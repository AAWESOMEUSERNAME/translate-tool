CREATE TABLE
  repository (
    id integer PRIMARY KEY autoincrement,
    name text NOT NULL,
    createdTime text,
    updatedTime text,
    description text,
    deleted integer DEFAULT 0
  );

CREATE TABLE
  article (
    id integer PRIMARY KEY autoincrement,
    name text NOT NULL,
    createdTime text,
    updatedTime text,
    description text,
    progress integer DEFAULT 0,
    coverPath text,
    status text DEFAULT 'translating',
    repositoryId integer NOT NULL,
    deleted integer DEFAULT 0
  );

CREATE TABLE
  paragraph (
    id integer PRIMARY KEY autoincrement,
    createdTime text,
    updatedTime text,
    content text DEFAULT '',
    articleId integer NOT NULL,
    orderNo integer DEFAULT 0,
    deleted integer DEFAULT 0
  );

CREATE TABLE
  translation (
    id integer PRIMARY KEY autoincrement,
    createdTime text,
    updatedTime text,
    tag text,
    content text DEFAULT '',
    articleId integer NOT NULL,
    paragraphId integer NOT NULL,
    deleted integer DEFAULT 0
  );
