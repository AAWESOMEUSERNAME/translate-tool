INSERT INTO
  repository (name, createdTime, updatedTime, description)
VALUES
  (
    'mock-repo01',
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    '测试'
  );

INSERT INTO
  article (
    name,
    createdTime,
    updatedTime,
    description,
    status,
    repositoryId
  )
VALUES
  (
    'mock-article01',
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    '测试文章',
    'translating',
    1
  );

INSERT INTO
  paragraph (createdTime, updatedTime, content, articleId)
VALUES
  (
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    '一个是使用国内的镜像网站，比如阿里云的镜像站点。但是这个方法有个需要考虑到的问题，那就是生成的packeage-lock.json 文件中会带有镜像的下载地址，自己家里的机器用没问题，公司的产品会有点不方便。',
    1
  );
INSERT INTO
  paragraph (createdTime, updatedTime, content, articleId)
VALUES
  (
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    '一个是使用国内的镜像网站，比如阿里云的镜像站点。但是这个方法有个需要考虑到的问题，那就是生成的packeage-lock.json 文件中会带有镜像的下载地址，自己家里的机器用没问题，公司的产品会有点不方便。',
    1
  );
INSERT INTO
  paragraph (createdTime, updatedTime, content, articleId)
VALUES
  (
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    '一个是使用国内的镜像网站，比如阿里云的镜像站点。但是这个方法有个需要考虑到的问题，那就是生成的packeage-lock.json 文件中会带有镜像的下载地址，自己家里的机器用没问题，公司的产品会有点不方便。',
    1
  );
INSERT INTO
  paragraph (createdTime, updatedTime, content, articleId)
VALUES
  (
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    '一个是使用国内的镜像网站，比如阿里云的镜像站点。但是这个方法有个需要考虑到的问题，那就是生成的packeage-lock.json 文件中会带有镜像的下载地址，自己家里的机器用没问题，公司的产品会有点不方便。',
    1
  );
INSERT INTO
  paragraph (createdTime, updatedTime, content, articleId)
VALUES
  (
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    '一个是使用国内的镜像网站，比如阿里云的镜像站点。但是这个方法有个需要考虑到的问题，那就是生成的packeage-lock.json 文件中会带有镜像的下载地址，自己家里的机器用没问题，公司的产品会有点不方便。',
    1
  );
INSERT INTO
  paragraph (createdTime, updatedTime, content, articleId)
VALUES
  (
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    '一个是使用国内的镜像网站，比如阿里云的镜像站点。但是这个方法有个需要考虑到的问题，那就是生成的packeage-lock.json 文件中会带有镜像的下载地址，自己家里的机器用没问题，公司的产品会有点不方便。',
    1
  );
INSERT INTO
  paragraph (createdTime, updatedTime, content, articleId)
VALUES
  (
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    '一个是使用国内的镜像网站，比如阿里云的镜像站点。但是这个方法有个需要考虑到的问题，那就是生成的packeage-lock.json 文件中会带有镜像的下载地址，自己家里的机器用没问题，公司的产品会有点不方便。',
    1
  );
INSERT INTO
  paragraph (createdTime, updatedTime, content, articleId)
VALUES
  (
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    '一个是使用国内的镜像网站，比如阿里云的镜像站点。但是这个方法有个需要考虑到的问题，那就是生成的packeage-lock.json 文件中会带有镜像的下载地址，自己家里的机器用没问题，公司的产品会有点不方便。',
    1
  );
INSERT INTO
  paragraph (createdTime, updatedTime, content, articleId)
VALUES
  (
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    'test2',
    1
  );

INSERT INTO
  translation (
    createdTime,
    updatedTime,
    tag,
    content,
    articleId,
    paragraphId
  )
VALUES
  (
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    'tag1',
    '翻译1',
    1,
    1
  );

INSERT INTO
  translation (
    createdTime,
    updatedTime,
    tag,
    content,
    articleId,
    paragraphId
  )
VALUES
  (
    '2020-1-1 00:00:00',
    '2020-1-1 00:00:00',
    '标签2',
    '翻译2',
    1,
    1
  );
