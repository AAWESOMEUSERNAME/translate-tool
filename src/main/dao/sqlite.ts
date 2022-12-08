import Database from 'better-sqlite3';
import { app } from 'electron';
import fs from 'fs';
import { IArticleDao, IParagraphDao, IRepositoryDao, ITranslationDao } from ".";
import { nowStr } from "../../common/utils/date";
import { getAssetPath, saveTxtFile } from "../util";

class SqliteConnPool {
  constructor() {

    if (!app.isPackaged) {
      const p = getAssetPath('sqlite', 'test.sqlite')
      this.db = new Database(p)
      this.db.transaction(() => {
        this.db.exec(`
        drop table IF EXISTS repository;
        drop table IF EXISTS article;
        drop table IF EXISTS paragraph;
        drop table IF EXISTS translation;
        `)

        console.log('init database');
        const init = fs.readFileSync(getAssetPath('sqlite', 'init.sql')).toString()
        this.db.exec(init)
        const data = fs.readFileSync(getAssetPath('sqlite', 'test.sql')).toString()
        this.db.exec(data)
      })()
    } else {
      const p = getAssetPath('sqlite', 'mainData.sqlite')
      this.db = new Database(p)
      const tableCount = this.db.prepare(
        `SELECT count(*) as count FROM sqlite_master WHERE type = 'table' and name != 'sqlite_sequence'`
      ).get().count
      if (tableCount === 0) {
        const sql = fs.readFileSync(getAssetPath('sqlite', 'init.sql')).toString()
        this.db.exec(sql)
      }
    }
  }

  private db: Database.Database

  getDb() {
    return this.db
  }
}

const _pool = new SqliteConnPool()

export class RepositoryDao implements IRepositoryDao {
  list(): DTO.RepositoryInfo[] {
    const db = _pool.getDb()
    const articleRecords = db.prepare('select * from article where deleted <> 1').all() as Entity.ArticleRecord[]
    const repoRecords = db.prepare('select * from repository where deleted <> 1').all() as Entity.RepositoryRecord[]
    return repoRecords.map(repoR => {
      const articleInfos: DTO.ArticleInfo[] = []
      articleRecords.forEach(aR => {
        if (aR.repositoryId === repoR.id) {
          articleInfos.push({
            ...aR,
          })
        }
      })
      const repoInfo: DTO.RepositoryInfo = {
        ...repoR,
        totalNum: articleRecords.length,
        uncompleted: articleRecords.filter(a => a.status !== 'confirmed').length
      }
      return repoInfo
    })
  }

  save(info: Partial<DTO.RepositoryInfo>) {
    const db = _pool.getDb()
    if (info.id) {
      db.prepare(`update repository set
      ${info.name ? `name='${info.name}',` : ''}
      ${info.description !== undefined ? `description='${info.description}',` : ''}
      updatedTime='${nowStr()}' where id = ?`).run(info.id)
    } else {
      db.prepare(`insert into repository(name, createdTime, updatedTime, description)
      values(?,?,?,?)`).run(info.name, nowStr(), nowStr(), info.description)
    }
  }

  remove(id: number) {
    _pool.getDb().prepare('update repository set deleted=1 where id = ?').run(id)
  }
}

export class ArticleDao implements IArticleDao {
  list(repoId: number) {
    const db = _pool.getDb()
    const articles = db.prepare('select * from article where repositoryId = ? and deleted <> 1').all(repoId) as Entity.ArticleRecord[]
    if (articles.length === 0) return []

    return articles.map(a => {
      const ps = db.prepare('select * from paragraph where articleId = ? and deleted <> 1').all(a.id) as Entity.ParagraphRecord[]
      const completedCount = (db.prepare(
        `select count(1) as completed from translation
          where paragraphId in (${ps.map(p => p.id).join(',')}) and deleted <> 1 and length(content) > 0
          group by tag`
      ).all() as { completed: number }[]).map(r => r.completed)

      const max = Math.max(...completedCount, 0)
      const processNum = ps.length === 0 ? 0 : Math.floor((max / ps.length) * 100)
      console.log('list', ps, completedCount, max, processNum);

      return {
        ...a,
        progress: processNum
      }
    })
  }
  remove(id: number) {
    _pool.getDb().prepare('update article set deleted = 1 where id = ?').run(id)
  }
  export({ id, tag, type }: RequestParams.ArticleExport) {
    const db = _pool.getDb()
    const paragraphes = db.prepare(
      'select * from paragraph where articleId = ? and deleted <> 1'
    ).all(id)
    const translations = db.prepare(
      `select * from translation where paragraphId in (${paragraphes.map(p => p.id).join(',')}) and deleted <> 1 and tag = ?`
    ).all(tag)
    const translationMap = translations.reduce((p, c) => {
      return {
        ...p,
        [c.paragraphId]: c
      }
    }, {})

    switch (type) {
      case 'raw': {
        const fullText = paragraphes.map(p => p.content).join('\r\n\r\n')
        saveTxtFile(fullText, '原文')
        break;
      }
      case 'raw_translated': {
        const fullText = paragraphes.map(p => {
          return p.content + '\r\n\r\n' + (translationMap[p.id]?.content ?? ' ')
        }).join('\r\n -- \r\n')
        saveTxtFile(fullText, '双语')
        break;
      }
      default: {
        const fullText = paragraphes.map(p => {
          return translationMap[p.id]?.content ?? ' '
        }).join('\r\n\r\n')
        saveTxtFile(fullText, '译文')
      }
    }

  }
  save(info: RequestParams.ArticleSave) {
    const db = _pool.getDb()
    db.transaction(() => {
      if (info.id) {
        db.prepare(`update article set
        ${info.name ? `name = '${info.name}',` : ''}
        ${info.description !== undefined ? `description = '${info.description}',` : ''}
        ${info.progress !== undefined ? `progress=${info.progress},` : ''}
        ${info.coverPath !== undefined ? `coverPath='${info.coverPath}',` : ''}
        ${info.status ? `status='${info.status}',` : ''}
        updatedTime='${nowStr()}' where deleted <> 1 and id = ?`).run(info.id)
      } else {
        const { lastInsertRowid } = db.prepare(
          `insert into article (
              name,
              createdTime,
              updatedTime,
              description,
              repositoryId,
              coverPath
            ) values(?,?,?,?,?,?)`
        ).run(
          info.name, nowStr(), nowStr(), info.description, info.repoId, info.coverPath || ''
        )

        const record = db.prepare('select id from article where rowid = ?').get(lastInsertRowid)
        const insertParagraph = db.prepare(
          `insert into paragraph (createdTime, updatedTime, content, articleId, orderNo) values(?,?,?,?,?)`
        )

        if (info.paragraphes) {
          for (let i = 0; i < info.paragraphes.length; i++) {
            const p = info.paragraphes[i];
            const paragraph = p.trim()
            paragraph && insertParagraph.run(nowStr(), nowStr(), p, record.id, i)
          }
        }
      }
    })()
  }
  detail(id: number): Model.Article {
    const db = _pool.getDb()
    const aritcle = db.prepare('select * from article where id = ? and deleted <> 1').get(id)
    const paragraphes = db.prepare('select * from paragraph where articleId = ? and deleted <> 1 order by orderNo,id').all(id)
    const pIds = paragraphes.map(p => p.id).join(',')
    const translations = paragraphes.length > 0 ? db.prepare(`select * from translation where paragraphId in (${pIds}) and deleted <> 1`).all() : []

    return {
      ...aritcle,
      paragraphes: paragraphes.map(p => ({
        ...p,
        translation: translations.filter(t => t.paragraphId === p.id)
      }))
    }
  }
}

export class ParagraphDao implements IParagraphDao {

  reOrder(params: RequestParams.ParagraphReOrder) {
    const db = _pool.getDb()

    db.transaction(() => {
      for (const args of params) {
        db.prepare('update paragraph set orderNo=? where id=? and orderNo <>?').run(args.newOrderNo, args.id, args.newOrderNo)
      }
    })()
  }

  save({ id, text, articleId }: RequestParams.ParagraphSave) {
    const db = _pool.getDb()

    if (id) {
      db.prepare('update paragraph set content=?,updatedTime=? where id =? and deleted <> 1').run(text, nowStr(), id)
    } else {
      db.prepare('insert into paragraph(createdTime, updatedTime, content, articleId) values(?,?,?,?)').run(nowStr(), nowStr(), text, articleId)
    }
  }
}

export class TranslationDao implements ITranslationDao {
  listTag(articleId: number) {
    const db = _pool.getDb()
    return db.prepare('select distinct tag from translation where articleId = ? and deleted <> 1').all(articleId).map(r => r.tag)
  };

  saveTag({ articleId, newTag, oldTag }: RequestParams.TagSave) {
    const db = _pool.getDb()
    db.transaction(() => {
      if (oldTag) {
        db.prepare('update translation set tag=?,updatedTime=? where articleId=? and tag=? and deleted <> 1').run(newTag, nowStr(), articleId, oldTag)
      } else {
        const ps = db.prepare('select * from paragraph where articleId = ? and deleted <> 1').all(articleId) as Entity.ParagraphRecord[]
        for (const p of ps) {
          db.prepare(`insert into translation(
            createdTime,
            updatedTime,
            tag,
            content,
            articleId,
            paragraphId
          ) values (?,?,?,?,?,?)`).run(
            nowStr(), nowStr(), newTag, '', articleId, p.id
          )
        }
      }
    })
  }

  save({ articleId, paragraphId, tag, content }: Pick<Entity.TranslationRecord, 'articleId' | 'paragraphId' | 'tag' | 'content'>) {
    const db = _pool.getDb()
    const t = db.prepare('select * from translation where articleId =? and paragraphId =? and tag = ? and deleted <> 1').get(articleId, paragraphId, tag)
    if (t) {
      db.prepare('update translation set content=?,updatedTime = ? where id = ?').run(content, nowStr(), t.id)
    } else {
      db.prepare(`insert into translation(
        createdTime,
        updatedTime,
        tag,
        content,
        articleId,
        paragraphId
      ) values (?,?,?,?,?,?)`).run(
        nowStr(), nowStr(), tag, content, articleId, paragraphId
      )
    }
  };
}
