---
title: MySQL数据库：增删改查
published: 2026-07-22
pinned: false
description: "了解MySQL基本CRUD语法."
tags: ["MySQL"]
category: MySQL
draft: false
---



> 思路整理： `DDL -> DML -> DQL -> 约束 -> 数据库设计 -> 多表查询 -> 索引 -> 事务 -> 视图 -> 用户权限 -> JDBC` 学习。

# 0. MySQL 总览
## 0.1 数据库是什么
数据库可以理解为：**专门用来长期保存、管理、查询、修改数据的软件系统**。

普通文件也能保存数据，但当数据量变大、多人同时访问、需要快速查询、需要保证数据安全时，普通文件就不够用了。数据库的价值主要在于：

| 作用 | 说明 |
| --- | --- |
| 数据持久化 | 程序关闭或电脑重启后，数据仍然保存 |
| 结构化存储 | 数据按表、行、列组织，查询和维护方便 |
| 数据完整性 | 通过约束保证数据尽量正确，比如主键不能重复 |
| 并发控制 | 多个人同时操作数据时，尽量避免数据混乱 |
| 查询优化 | 数据库会通过索引、优化器提升查询效率 |
| 事务管理 | 一组操作要么都成功，要么都失败，适合转账、下单等场景 |
| 权限控制 | 不同用户只能操作自己有权限的数据 |


## 0.2 关系型数据库是什么
关系型数据库用**二维表**保存数据。

一张表可以理解为 Excel 表格：

| 数据库概念 | 类比 | 说明 |
| --- | --- | --- |
| 数据库服务器 | 一台安装 MySQL 的机器 | 可以管理多个数据库 |
| 数据库 database/schema | 一个项目的数据空间 | 一个项目一般建一个数据库 |
| 表 table | Excel 中的一张表 | 保存某一类实体的数据 |
| 行 row/record | Excel 中的一行 | 表示一条数据记录 |
| 列 column/field | Excel 中的一列 | 表示实体的一个属性 |
| 主键 primary key | 唯一编号 | 用来唯一标识一行数据 |


例如学生管理系统中：

```latex
数据库：student_system
表：student、class、course、score
行：student 表中的一条学生记录
列：id、name、age、gender、class_id
```

## 0.3 MySQL 服务端、客户端、数据库之间的关系
MySQL 安装后主要有两个角度：

| 组成 | 说明 |
| --- | --- |
| `mysqld` | MySQL 服务端程序，真正管理数据 |
| `mysql` | 命令行客户端，用来连接服务端并发送 SQL |
| Navicat / DBeaver / Workbench | 图形化客户端，本质也是连接 MySQL 服务端 |


操作流程可以理解为：

```latex
客户端输入 SQL
    -> 发送给 MySQL 服务端
        -> 服务端解析 SQL
            -> 优化 SQL
                -> 存储引擎读写数据文件
                    -> 返回结果给客户端
```

## 0.4 SQL 分类
SQL 是结构化查询语言，用来操作关系型数据库。常见分类如下：

| 分类 | 全称 | 作用 | 常见语句 |
| --- | --- | --- | --- |
| DDL | Data Definition Language | 定义数据库结构 | `create`、`drop`、`alter`、`truncate` |
| DML | Data Manipulation Language | 增删改表中数据 | `insert`、`update`、`delete` |
| DQL | Data Query Language | 查询数据 | `select` |
| DCL | Data Control Language | 权限控制 | `grant`、`revoke` |
| TCL | Transaction Control Language | 事务控制 | `start transaction`、`commit`、`rollback` |


> **DDL 管结构，DML 改数据，DQL 查数据，DCL 管权限，TCL 管事务。**
>

---

# 1. DDL：数据库和表结构操作
DDL 主要负责**创建、查看、修改、删除数据库结构**。这里的结构包括数据库、表、字段、字段类型、字段约束等。

## 1.1 数据库操作
### 1.1.1 查看所有数据库
```sql
show databases;
```

**为什么要先看数据库？**

因为 MySQL 服务端中可以存在多个数据库。操作前先查看已有数据库，可以避免误操作系统库或别的项目库。

系统库常见有：

| 系统库 | 说明 |
| --- | --- |
| `mysql` | 保存用户、权限等系统信息 |
| `information_schema` | 保存数据库元数据，比如表、列、索引信息 |
| `performance_schema` | 性能监控相关数据 |
| `sys` | 系统视图，方便查看 MySQL 运行状态 |


### 1.1.2 查看当前正在使用的数据库
```sql
select database();
```

**原因：**

很多语句默认作用于当前数据库。如果当前数据库不是你想操作的库，就可能创建错表或删除错表。

### 1.1.3 创建数据库
基本语法：

```sql
create database 数据库名;
```

推荐语法：

```sql
create database if not exists 数据库名
default character set utf8mb4
collate utf8mb4_0900_ai_ci;
```

示例：

```sql
create database if not exists mysql_study
default character set utf8mb4
collate utf8mb4_0900_ai_ci;
```

**每部分原因：**

| 写法 | 原因 |
| --- | --- |
| `if not exists` | 数据库已存在时不报错，只给警告，适合重复执行脚本 |
| `utf8mb4` | 支持中文、emoji、更多 Unicode 字符 |
| `collate` | 指定排序和比较规则，比如大小写是否敏感 |


### 1.1.4 字符集与排序规则
字符集决定**字符怎么保存**，排序规则决定**字符怎么比较和排序**

查看 MySQL 支持的字符集：

```sql
show charset;
```

查看排序规则：

```sql
show collation;
```

查看当前服务器默认字符集：

```sql
show variables like 'character_set%';
```

查看当前服务器默认排序规则：

```sql
show variables like 'collation%';
```

常见规则：

| 排序规则 | 含义 |
| --- | --- |
| `utf8mb4_0900_ai_ci` | MySQL 8 默认常见规则，大小写不敏感、重音不敏感 |
| `utf8mb4_general_ci` | 老版本常见规则，兼容性较好 |
| `utf8mb4_bin` | 按二进制比较，大小写敏感 |


其中：

| 缩写 | 含义 |
| --- | --- |
| `ci` | case insensitive，大小写不敏感 |
| `cs` | case sensitive，大小写敏感 |
| `ai` | accent insensitive，重音不敏感 |
| `as` | accent sensitive，重音敏感 |


### 1.1.5 使用数据库
```sql
use 数据库名;
```

示例：

```sql
use mysql_study;
```

**原因：**

创建表、插入数据、查询数据通常都要在某个数据库中进行。执行 `use` 后，后续没有指定库名的表操作都会默认作用在这个库中。

### 1.1.6 查看建库语句
```sql
show create database 数据库名;
```

示例：

```sql
show create database mysql_study;
```

**原因：**

可以确认数据库的字符集、排序规则是否符合预期。

### 1.1.7 修改数据库字符集和排序规则
```sql
alter database 数据库名
character set utf8mb4
collate utf8mb4_0900_ai_ci;
```

示例：

```sql
alter database mysql_study
character set utf8mb4
collate utf8mb4_0900_ai_ci;
```

**注意：**

这主要影响后续新建对象的默认规则，不一定会自动改变已有表和已有字段的字符集。

### 1.1.8 删除数据库
```sql
drop database if exists 数据库名;
```

示例：

```sql
drop database if exists mysql_study;
```

**原因和风险：**

`drop database` 会删除整个数据库，里面所有表和数据都会被删除。真实项目中不要随便执行，尤其不要在生产环境执行。

---

## 1.2 数据类型
创建表时，每个字段都必须指定数据类型。

**选择数据类型的核心原则：**

1. 能准确表达业务含义；
2. 范围够用，不浪费空间；
3. 需要精确计算的不要用浮点数；
4. 字符串长度尽量贴近实际业务；
5. 时间字段根据是否需要日期、时间、时区特性来选。

### 1.2.1 常用数据类型分类
| 分类 | 常用类型 | 适合保存 |
| --- | --- | --- |
| 整数类型 | `tinyint`、`smallint`、`int`、`bigint` | 年龄、编号、数量、状态 |
| 小数类型 | `decimal`、`float`、`double` | 金额、成绩、比例、测量值 |
| 字符串类型 | `char`、`varchar`、`text` | 姓名、手机号、邮箱、文章 |
| 日期时间类型 | `date`、`time`、`datetime`、`timestamp` | 生日、创建时间、更新时间 |
| 二进制类型 | `binary`、`varbinary`、`blob` | 图片、文件、二进制数据 |


### 1.2.2 整数类型
| 类型 | 空间 | 有符号范围 | 无符号范围 | 常见用途 |
| --- | --- | --- | --- | --- |
| `tinyint` | 1 byte | -128 ~ 127 | 0 ~ 255 | 状态、性别、年龄 |
| `smallint` | 2 bytes | -32768 ~ 32767 | 0 ~ 65535 | 小范围数量 |
| `mediumint` | 3 bytes | -8388608 ~ 8388607 | 0 ~ 16777215 | 中等范围编号 |
| `int` | 4 bytes | -2147483648 ~ 2147483647 | 0 ~ 4294967295 | 常规 ID、数量 |
| `bigint` | 8 bytes | 很大 | 很大 | 大型系统 ID、雪花 ID |


示例：

```sql
create table type_int_demo (
    id bigint primary key auto_increment,
    age tinyint unsigned,
    status tinyint,
    view_count int unsigned
);
```

**为什么年龄用 **`tinyint unsigned`**？**

年龄不会是负数，`tinyint unsigned` 范围是 0 到 255，已经足够。比 `int` 更节省空间。

**为什么 ID 常用 **`bigint`**？**

大型系统中数据量可能很大，分布式 ID 也经常超出 `int` 范围，所以用 `bigint` 更安全。

### 1.2.3 小数类型
| 类型 | 特点 | 适合场景 |
| --- | --- | --- |
| `float` | 单精度浮点数，可能有精度误差 | 科学计算、要求不高的测量值 |
| `double` | 双精度浮点数，也可能有精度误差 | 高精度测量、非金额计算 |
| `decimal(M,D)` | 定点数，不存在二进制浮点误差 | 金额、工资、价格、财务数据 |


示例：

```sql
create table product (
    id bigint primary key auto_increment,
    name varchar(50) not null,
    price decimal(10, 2) not null
);
```

`decimal(10,2)` 表示总共最多 10 位数字，其中小数点后 2 位。

可以保存：

```latex
99999999.99
```

不能保存：

```latex
999999999.99
```

因为总位数超过 10。

**为什么金额不要用 float/double？**

浮点数在计算机底层用二进制近似表示，可能出现 `0.1 + 0.2 != 0.3` 这样的精度误差。金额必须精确，所以用 `decimal`。

### 1.2.4 字符串类型
| 类型 | 特点 | 最大长度 | 适合保存 |
| --- | --- | --- | --- |
| `char(n)` | 固定长度 | 0~255 字符 | 身份证号、MD5、性别编码 |
| `varchar(n)` | 可变长度 | 取决于行大小和字符集 | 姓名、标题、邮箱、手机号 |
| `text` | 长文本 | 较大 | 文章、评论、描述 |


#### char 与 varchar 的区别
| 对比 | `char(n)` | `varchar(n)` |
| --- | --- | --- |
| 长度 | 固定长度 | 可变长度 |
| 空间 | 不足 n 也按 n 存储，可能补空格 | 按实际长度存储，额外记录长度 |
| 查询效率 | 通常略快 | 通常略慢 |
| 适合 | 长度固定的数据 | 长度不固定的数据 |


示例：

```sql
create table user_account (
    id bigint primary key auto_increment,
    username varchar(30) not null,
    password_md5 char(32) not null,
    phone char(11),
    intro text
);
```

**为什么密码 MD5 用 **`char(32)`**？**

MD5 字符串固定 32 位，长度不会变化，用 `char(32)` 合适。

**为什么用户名用 **`varchar(30)`**？**

用户名长度不固定，有的人 3 个字符，有的人 20 个字符，用 `varchar` 更节省空间。

### 1.2.5 日期时间类型
| 类型 | 格式 | 适合保存 |
| --- | --- | --- |
| `date` | `YYYY-MM-DD` | 生日、日期 |
| `time` | `HH:MM:SS` | 时间点、耗时 |
| `datetime` | `YYYY-MM-DD HH:MM:SS` | 创建时间、更新时间 |
| `timestamp` | `YYYY-MM-DD HH:MM:SS` | 时间戳，受时区影响 |
| `year` | `YYYY` | 年份 |


示例：

```sql
create table article (
    id bigint primary key auto_increment,
    title varchar(100) not null,
    publish_date date,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp
);
```

**为什么创建时间用 **`datetime`**？**

创建时间需要日期和具体时间，不只是日期，所以不用 `date`。

`datetime`** 与 **`timestamp`** 简单区别：**

| 对比 | `datetime` | `timestamp` |
| --- | --- | --- |
| 时区影响 | 不受时区自动转换影响 | 受时区转换影响 |
| 范围 | 更大 | 较小 |
| 常用场景 | 业务时间 | 记录系统时间戳 |


---

## 1.3 表操作：查询、创建、修改、删除
### 1.3.1 查看当前数据库中的所有表
```sql
show tables;
```

**原因：**

确认当前数据库里有哪些表，避免重复建表或误删表。

### 1.3.2 查看表结构
```sql
desc 表名;
```

示例：

```sql
desc users;
```

结果中常见字段：

| 列 | 说明 |
| --- | --- |
| `Field` | 字段名 |
| `Type` | 字段类型 |
| `Null` | 是否允许为 `NULL` |
| `Key` | 是否有索引/主键/唯一键 |
| `Default` | 默认值 |
| `Extra` | 额外信息，比如 `auto_increment` |


### 1.3.3 查看建表语句
```sql
show create table 表名;
```

示例：

```sql
show create table users;
```

**原因：**

`desc` 只能看大概结构，`show create table` 能看到完整建表语句，包括字符集、引擎、约束、索引等。

### 1.3.4 创建表基本语法
```sql
create table 表名 (
    字段名1 数据类型 [约束] [comment '字段注释'],
    字段名2 数据类型 [约束] [comment '字段注释'],
    字段名3 数据类型 [约束] [comment '字段注释']
) engine = InnoDB
  default character set = utf8mb4
  collate = utf8mb4_0900_ai_ci
  comment = '表注释';
```

示例：

```sql
drop table if exists users;

create table users (
    id bigint primary key auto_increment comment '用户ID',
    username varchar(30) not null unique comment '用户名',
    password char(32) not null comment 'MD5密码',
    phone char(11) comment '手机号',
    birthday date comment '生日',
    created_at datetime default current_timestamp comment '创建时间'
) engine = InnoDB
  default character set = utf8mb4
  collate = utf8mb4_0900_ai_ci
  comment = '用户表';
```

**每一步原因：**

| 操作 | 原因 |
| --- | --- |
| `drop table if exists users` | 练习时方便重复执行，避免表已存在报错 |
| `id bigint primary key auto_increment` | 每条用户数据都需要唯一标识，并自动递增 |
| `username not null unique` | 用户名不能为空，也不能重复 |
| `password char(32)` | MD5 固定 32 位 |
| `created_at default current_timestamp` | 插入时自动记录创建时间 |
| `engine = InnoDB` | InnoDB 支持事务、外键、行级锁，是 MySQL 常用默认引擎 |


### 1.3.5 修改表结构：ALTER TABLE
#### 添加字段
```sql
alter table 表名 add 字段名 数据类型 [约束] [comment '注释'];
```

示例：

```sql
alter table users add email varchar(100) comment '邮箱';
```

**原因：**

项目需求变化时，可能需要给已有表增加新属性。

#### 修改字段类型
```sql
alter table 表名 modify 字段名 新数据类型 [约束];
```

示例：

```sql
alter table users modify username varchar(50) not null;
```

**原因：**

原来用户名长度 30 不够，需要扩大为 50。

#### 修改字段名和字段类型
```sql
alter table 表名 change 旧字段名 新字段名 新数据类型 [约束] [comment '注释'];
```

示例：

```sql
alter table users change phone mobile char(11) comment '手机号';
```

**原因：**

`change` 可以同时改字段名和字段类型。即使只改字段名，也必须写新类型。

#### 删除字段
```sql
alter table 表名 drop column 字段名;
```

示例：

```sql
alter table users drop column email;
```

**注意：**

删除字段会丢失这一列的所有数据，真实项目中要先备份或确认业务不再使用。

#### 修改表名
```sql
alter table 旧表名 rename to 新表名;
```

示例：

```sql
alter table users rename to user_account;
```



### 1.3.6 删除表
```sql
drop table if exists 表名;
```

示例：

```sql
drop table if exists user_account;
```

**原因和风险：**

`drop table` 删除表结构和数据，表直接不存在。比 `delete` 更危险。



### 1.3.7 清空表：TRUNCATE
```sql
truncate table 表名;
```

或者：

```sql
truncate 表名;
```

`delete` 与 `truncate` 对比：

| 对比项 | `delete from 表名;` | `truncate table 表名;` |
| --- | --- | --- |
| 删除对象 | 删除数据行 | 清空整张表 |
| 是否保留表结构 | 保留 | 保留 |
| 是否能加 `where` | 可以 | 不可以 |
| 自增计数 | 通常不重置或依情况 | 通常重置 |
| 适合场景 | 按条件删除 | 清空测试表 |
| 危险程度 | 高 | 更高 |


**注意：**

`truncate` 不是删除表，而是清空表。初学阶段只建议在测试表上使用。

---

# 2. DML：数据增删改
DML 操作的是**表中的数据行**，不是表结构。

常见 DML：

| 操作 | 语句 |
| --- | --- |
| 新增 | `insert` |
| 修改 | `update` |
| 删除 | `delete` |


---

## 2.1 INSERT：添加数据
### 2.1.1 指定字段插入
```sql
insert into 表名(字段1, 字段2, 字段3)
values(值1, 值2, 值3);
```

示例：

```sql
insert into users(username, password, phone)
values('zhangsan', 'e10adc3949ba59abbe56e057f20f883e', '13800000000');
```

**原因：**

推荐指定字段插入，因为表结构变化时不容易出错。例如后面增加一个字段，原来的插入语句仍然能执行。

### 2.1.2 全字段插入
```sql
insert into 表名 values(值1, 值2, 值3, ...);
```

示例：

```sql
insert into users
values(1, 'lisi', 'e10adc3949ba59abbe56e057f20f883e', '13900000000', '2000-01-01', now());
```

**注意：**

全字段插入要求值的个数、顺序必须和表结构完全一致。真实项目中不推荐。

### 2.1.3 批量插入
```sql
insert into 表名(字段1, 字段2)
values
(值1, 值2),
(值1, 值2),
(值1, 值2);
```

示例：

```sql
insert into users(username, password, phone)
values
('wangwu', '12345678901234567890123456789012', '13700000000'),
('zhaoliu', '12345678901234567890123456789012', '13600000000'),
('qianqi', '12345678901234567890123456789012', '13500000000');
```

**原因：**

批量插入比多次单行插入效率更高，因为一次 SQL 可以插入多行数据。

### 2.1.4 插入查询结果
对应语法为：

```sql
insert into 新表 (列1, 列2, ...)
select 列1, 列2, ...
from 旧表
where 条件;
```

同样在此基础上还能继续拓展多种操作，比如带条件迁移、迁移时修改数据，该知识点另有补充。

### 2.1.5 插入注意事项
1. 字符串和日期要加单引号：

```sql
'张三'
'2026-05-08'
```

2. 数字一般不用引号：

```sql
18
99.5
```

3. 插入指定字段时，值的顺序必须和字段顺序一致。
4. 有 `auto_increment` 的主键通常不用手动插入。

---

## 2.2 UPDATE：修改数据
基本语法：

```sql
update 表名
set 字段1 = 值1,
    字段2 = 值2
where 条件;
```

示例：

```sql
update users
set phone = '13811112222'
where username = 'zhangsan';
```

**每一步原因：**

| 部分 | 原因 |
| --- | --- |
| `update users` | 指定要修改哪张表 |
| `set phone = ...` | 指定要修改哪个字段、改成什么值 |
| `where username = ...` | 限定只修改某个用户 |


### 2.2.1 修改多个字段
```sql
update users
set phone = '13811112222',
    birthday = '2001-02-03'
where id = 1;
```

### 2.2.2 没有 WHERE 的风险
```sql
update users
set phone = '00000000000';
```

这会把整张表所有用户的手机号都改掉。

**结论：**

执行 `update` 前先写 `select` 验证条件：

```sql
select * from users where id = 1;
```

确认结果正确后，再执行：

```sql
update users set phone = '13811112222' where id = 1;
```

---

## 2.3 DELETE：删除数据
基本语法：

```sql
delete from 表名 where 条件;
```

示例：

```sql
delete from users where id = 3;
```

**原因：**

`where` 用来限定删除范围。没有 `where` 会删除整张表所有数据。

### 2.3.1 删除字段为 NULL 的记录
```sql
delete from users where phone is null;
```

**为什么不能写 **`phone = null`**？**

SQL 中 `NULL` 表示未知值，不能用 `=` 判断，必须用：

```sql
is null
is not null
```

### 2.3.2 DELETE 不能删除某一列的值
错误理解：

```sql
delete phone from users where id = 1;
```

`delete` 删除的是整行数据，不是某个字段值。

如果只想清空手机号，应使用：

```sql
update users set phone = null where id = 1;
```

或者：

```sql
update users set phone = '' where id = 1;
```

区别：

| 写法 | 含义 |
| --- | --- |
| `null` | 没有值、未知 |
| `''` | 空字符串，是一个具体字符串值 |


---

# 3. DQL：数据查询
DQL 的核心是 `select`。查询是 MySQL 中最常用、也是最重要的部分。

## 3.1 SELECT 语句完整结构
书写顺序：

```sql
select 字段列表
from 表名
where 条件列表
group by 分组字段
having 分组后条件
order by 排序字段
limit 分页参数;
```

执行顺序大致理解为：

```latex
from -> where -> group by -> 聚合函数 -> having -> select -> order by -> limit
```

**为什么要理解执行顺序？**

因为它能解释很多问题：

1. `where` 不能使用聚合函数，因为聚合还没执行；
2. `having` 可以使用聚合函数，因为它在分组统计之后执行；
3. `order by` 可以使用 `select` 中的别名，因为排序发生在 select 后面。

---

## 3.2 基本查询
### 3.2.1 查询所有列
```sql
select * from 表名;
```

示例：

```sql
select * from users;
```

**注意：**

练习时可以用 `*`，真实项目中尽量写具体字段。因为 `*` 会查询所有列，可能浪费网络和内存，也容易受表结构变化影响。

### 3.2.2 查询指定列
```sql
select 字段1, 字段2 from 表名;
```

示例：

```sql
select id, username, phone from users;
```

**原因：**

只查询需要的列，可以减少数据传输，提高查询效率。

### 3.2.3 查询表达式
```sql
select username, 10 from users;
```

```sql
select username, id + 1000 from users;
```

示例：

```sql
select username, year(now()) - year(birthday) as approx_age
from users;
```

**原因：**

`select` 后面不只能写字段，也可以写表达式、函数、常量。

### 3.2.4 设置别名
```sql
select 字段名 as 别名 from 表名;
```

`as` 可以省略：

```sql
select username 用户名 from users;
```

推荐写法：

```sql
select username as 用户名, phone as 手机号
from users;
```

**原因：**

别名可以让查询结果更易读，尤其是表达式和函数结果。

### 3.2.5 去重查询 DISTINCT
```sql
select distinct 字段名 from 表名;
```

示例：

```sql
select distinct phone from users;
```

多个字段去重：

```sql
select distinct class_id, gender from student;
```

**注意：**

多个字段一起 `distinct` 时，判断的是这一组字段组合是否重复，不是只看某一个字段。

---

## 3.3 WHERE 条件查询
基本语法：

```sql
select 字段列表
from 表名
where 条件;
```

### 3.3.1 比较运算符
| 运算符 | 含义 | 示例 |
| --- | --- | --- |
| `=` | 等于 | `age = 18` |
| `<>` 或 `!=` | 不等于 | `age <> 18` |
| `>` | 大于 | `score > 90` |
| `>=` | 大于等于 | `score >= 60` |
| `<` | 小于 | `age < 30` |
| `<=` | 小于等于 | `age <= 30` |
| `between ... and ...` | 在范围内，包含两端 | `age between 18 and 25` |
| `in (...)` | 在列表中 | `age in (18,20,22)` |
| `like` | 模糊匹配 | `name like '张%'` |
| `is null` | 是空值 | `phone is null` |
| `is not null` | 不是空值 | `phone is not null` |


### 3.3.2 逻辑运算符
| 运算符 | 含义 |
| --- | --- |
| `and` | 并且，多个条件都满足 |
| `or` | 或者，满足任意一个条件 |
| `not` | 取反 |


示例：

```sql
select * from student
where age >= 18 and gender = 1;
```

```sql
select * from student
where age = 18 or age = 20;
```

推荐改成：

```sql
select * from student
where age in (18, 20);
```

### 3.3.3 BETWEEN 范围查询
```sql
select * from student
where age between 18 and 25;
```

等价于：

```sql
select * from student
where age >= 18 and age <= 25;
```

**注意：**

`between 小值 and 大值` 包含两端。

### 3.3.4 IN 多选一
```sql
select * from student
where age in (18, 20, 40);
```

**原因：**

比多个 `or` 更简洁。

### 3.3.5 LIKE 模糊查询
| 通配符 | 含义 |
| --- | --- |
| `%` | 匹配任意个字符，包括 0 个 |
| `_` | 匹配单个字符 |


示例：

查询姓张的人：

```sql
select * from student
where name like '张%';
```

查询名字只有两个字的人：

```sql
select * from student
where name like '__';
```

查询身份证号最后一位是 X：

```sql
select * from student
where id_card like '%X';
```

**注意：**

`like '%关键字%'` 前面有 `%` 时，普通 B+Tree 索引通常很难有效使用。

### 3.3.6 NULL 查询
查询手机号为空：

```sql
select * from users where phone is null;
```

查询手机号不为空：

```sql
select * from users where phone is not null;
```

错误写法：

```sql
select * from users where phone = null;
```

---

## 3.4 ORDER BY 排序查询
基本语法：

```sql
select 字段列表
from 表名
order by 字段1 排序方式, 字段2 排序方式;
```

排序方式：

| 写法 | 含义 |
| --- | --- |
| `asc` | 升序，默认 |
| `desc` | 降序 |


示例：

```sql
select * from student
order by age asc;
```

```sql
select * from exam
order by math desc, english desc;
```

**原因：**

当第一个排序字段相同时，再按第二个排序字段排序。

---

## 3.5 LIMIT 分页查询
### 3.5.1 基本语法
```sql
select 字段列表
from 表名
limit 起始下标, 查询条数;
```

示例：

```sql
select * from student limit 0, 10;
```

表示从第 0 条开始，查询 10 条。

### 3.5.2 第 n 页公式
```latex
起始下标 = (页码 - 1) * 每页条数
```

第 1 页，每页 10 条：

```sql
limit 0, 10;
```

第 2 页，每页 10 条：

```sql
limit 10, 10;
```

第 3 页，每页 10 条：

```sql
limit 20, 10;
```

### 3.5.3 另一种写法
```sql
select * from student
limit 10 offset 20;
```

等价于：

```sql
select * from student
limit 20, 10;
```

---

## 3.6 聚合函数
聚合函数用于对多行（即某一整列）数据进行统计，最后通常返回一行结果。

| 函数 | 作用 |
| --- | --- |
| `count()` | 统计数量 |
| `sum()` | 求和 |
| `avg()` | 求平均值 |
| `max()` | 求最大值 |
| `min()` | 求最小值 |


### 3.6.1 COUNT
统计总行数：

```sql
select count(*) from student;
```

统计某列非 NULL 的数量：

```sql
select count(phone) from users;
```

区别：

| 写法 | 含义 |
| --- | --- |
| `count(*)` | 统计行数，包括字段为 NULL 的行 |
| `count(字段)` | 统计该字段不为 NULL 的行数 |


### 3.6.2 SUM
```sql
select sum(math) from exam;
```

### 3.6.3 AVG
```sql
select avg(math) from exam;
```

保留两位小数：

```sql
select round(avg(math), 2) as avg_math
from exam;
```

### 3.6.4 MAX / MIN
```sql
select max(math) from exam;
select min(math) from exam;
```

### 3.6.5 聚合函数注意事项
不带普通字段时，不需要 `group by`：

```sql
select avg(math) from exam;
```

聚合函数和普通字段一起出现时，普通字段通常必须配合 `group by`：

```sql
select class_name, avg(math)
from exam
group by class_name;
```

---

## 3.7 GROUP BY 分组查询
### 3.7.1 基本语法
```sql
select 分组字段, 聚合函数(字段)
from 表名
where 分组前条件
group by 分组字段
having 分组后条件;
```

### 3.7.2 按班级统计平均成绩
```sql
select
    class_name,
    round(avg(chinese), 2) as avg_chinese,
    round(avg(math), 2) as avg_math,
    round(avg(english), 2) as avg_english
from exam
group by class_name;
```

**执行逻辑：**

1. 先从 `exam` 表取数据；
2. 按 `class_name` 分组；
3. 每组分别计算语文、数学、英语平均分；
4. 返回每组统计结果。

### 3.7.3 WHERE 与 HAVING 区别
| 对比 | `where` | `having` |
| --- | --- | --- |
| 执行时间 | 分组前 | 分组后 |
| 过滤对象 | 原始数据行 | 分组后的结果 |
| 能否使用聚合函数 | 不能 | 能 |
| 常见用途 | 先筛选有效数据 | 筛选统计结果 |


### 3.7.4 WHERE 例子：先过滤学生，再分组
查询数学成绩 >= 80 的学生，再按班级统计人数：

```sql
select
    class_name,
    count(*) as student_count
from exam
where math >= 80
group by class_name;
```

逻辑：

1. 先筛选 `math >= 80` 的学生；
2. 再按照 `class_name` 分组；
3. 最后统计每个班剩下多少人。

### 3.7.5 HAVING 例子：先分组统计，再过滤结果
查询平均数学成绩 >= 80 的班级：

```sql
select
    class_name,
    round(avg(math), 2) as avg_math
from exam
group by class_name
having avg(math) >= 80;
```

逻辑：

1. 先按班级分组；
2. 计算每个班平均数学成绩；
3. 保留平均数学成绩 >= 80 的班级。

---

## 3.8 内置函数
## 3.8.1 日期函数
| 函数 | 作用 | 示例 |
| --- | --- | --- |
| `curdate()` | 当前日期 | `select curdate();` |
| `curtime()` | 当前时间 | `select curtime();` |
| `now()` | 当前日期和时间 | `select now();` |
| `date()` | 提取日期部分 | `select date('2026-05-08 14:30:25');` |
| `adddate()` | 日期增加 | `select adddate('2026-05-08', interval 7 day);` |
| `subdate()` | 日期减少 | `select subdate('2026-05-08', interval 7 day);` |
| `datediff()` | 两个日期相差天数 | `select datediff('2026-05-08','2026-05-01');` |


示例：查询最近 7 天注册的用户：

```sql
select * from users
where created_at >= subdate(now(), interval 7 day);
```

### 3.8.2 字符串函数
| 函数 | 作用 |
| --- | --- |
| `concat()` | 拼接字符串 |
| `char_length()` | 统计字符个数 |
| `length()` | 统计字节数 |
| `lower()` | 转小写 |
| `upper()` | 转大写 |
| `substring()` | 截取字符串 |
| `replace()` | 替换字符串 |
| `trim()` | 去掉首尾空格 |


示例：

```sql
select concat(username, '的手机号是：', phone) as info
from users;
```

```sql
select char_length('你好MySQL');
```

注意：

```sql
char_length('你好')
```

返回字符数；

```sql
length('你好')
```

返回字节数，和字符集有关。

### 3.8.3 数学函数
| 函数 | 作用 |
| --- | --- |
| `abs()` | 绝对值 |
| `ceil()` | 向上取整 |
| `floor()` | 向下取整 |
| `round()` | 四舍五入 |
| `rand()` | 随机数 |
| `mod()` | 取余 |
| `pow()` | 幂运算 |


示例：

```sql
select round(avg(math), 2) from exam;
```

生成随机数：

```sql
select rand();
```

生成 6 位随机数思路：

```sql
select floor(rand() * 1000000);
```

---

# 4. 数据库约束
约束是对表中数据的规则限制，用来保证数据准确、完整、可靠。

常见约束：

| 约束 | 作用 |
| --- | --- |
| `not null` | 非空，不能存 `NULL` |
| `default` | 默认值 |
| `unique` | 唯一，不能重复 |
| `primary key` | 主键，非空且唯一 |
| `foreign key` | 外键，保证表之间关系正确 |
| `check` | 检查值是否满足条件 |


---

## 4.1 NOT NULL 非空约束
示例：

```sql
create table student (
    id bigint,
    name varchar(20) not null
);
```

插入失败：

```sql
insert into student values(1, null);
```

**原因：**

学生姓名如果为 `NULL`，这条学生记录没有实际意义，所以要限制不能为空。

---

## 4.2 DEFAULT 默认值约束
示例：

```sql
create table student (
    id bigint,
    name varchar(20) not null,
    age int default 18
);
```

插入时不指定年龄：

```sql
insert into student(id, name) values(1, '张三');
```

查询结果中 `age` 自动为 18。

**原因：**

当某些字段大多数情况下都有相同初始值时，可以用默认值减少插入语句复杂度。

---

## 4.3 UNIQUE 唯一约束
示例：

```sql
create table users (
    id bigint primary key auto_increment,
    username varchar(30) not null unique,
    phone char(11) unique
);
```

**原因：**

用户名、手机号通常不能重复，否则登录、找回密码等业务会出现混乱。

**注意：**

唯一约束允许多个 `NULL` 的情况和数据库实现有关。实际设计时，如果字段必须唯一且必须存在，建议同时写：

```sql
phone char(11) not null unique
```

---

## 4.4 PRIMARY KEY 主键约束
主键特点：

1. 唯一；
2. 非空；
3. 一张表通常只有一个主键；
4. 可以由一个字段组成，也可以由多个字段组成。

### 4.4.1 单字段主键
```sql
create table student (
    id bigint primary key auto_increment,
    name varchar(20) not null
);
```

**为什么要主键？**

主键是每行数据的唯一身份。没有主键时，修改或删除某一行数据可能不精准。

### 4.4.2 联合主键
```sql
create table score (
    student_id bigint,
    course_id bigint,
    score decimal(5,2),
    primary key(student_id, course_id)
);
```

**原因：**

一个学生在一门课程中只能有一条成绩记录，所以 `(student_id, course_id)` 组合不能重复。

---

## 4.5 AUTO_INCREMENT 自增
示例：

```sql
create table student (
    id bigint primary key auto_increment,
    name varchar(20) not null
);
```

插入数据：

```sql
insert into student(name) values('张三');
insert into student(name) values('李四');
```

`id` 会自动生成 1、2、3...

**注意：**

1. 自增字段必须是索引，通常是主键；
2. 一张表只能有一个自增字段；
3. 删除数据后，自增值通常不会自动回退；
4. `truncate` 通常会重置自增计数。

---

## 4.6 FOREIGN KEY 外键约束
外键用于维护两张表之间的关系。

示例：班级表和学生表。

constraint_user

**原因：**

`student.class_id` 引用 `class.id`。有外键后，学生不能随便填一个不存在的班级编号。

### 4.6.1 外键带来的限制
如果 `class` 中没有 `id = 100` 的班级，下面插入会失败：

```sql
insert into student(name, class_id) values('张三', 100);
```

如果某个班级已经被学生引用，直接删除班级可能失败：

```sql
delete from class where id = 1;
```

**原因：**

数据库要防止学生表中出现“找不到班级”的脏数据。

### 4.6.2 外键动作
常见动作：

| 动作 | 说明 |
| --- | --- |
| `restrict` | 默认限制，不允许破坏关系 |
| `cascade` | 级联操作，父表更新/删除时子表跟着更新/删除 |
| `set null` | 父表删除后，子表外键设为 NULL |


示例：

```sql
constraint fk_student_class
foreign key(class_id) references class(id)
on delete set null
on update cascade
```

**注意：**

真实项目中很多团队不使用数据库物理外键，而是在业务代码中维护关系。初学阶段仍然要理解外键原理。

---

## 4.7 CHECK 检查约束
示例：

```sql
create table student (
    id bigint primary key auto_increment,
    name varchar(20) not null,
    age int check(age >= 0 and age <= 150),
    gender tinyint check(gender in (0, 1, 2))
);
```

**原因：**

限制字段值必须在合理范围内，比如年龄不能是负数。

