- [uni 验证码验证文档](#uni-验证码验证文档)
  - [获取验证码@create](#获取验证码create)
  - [校验验证码@verify](#校验验证码verify)
  - [刷新验证码@refresh](#刷新验证码refresh)
- [错误码](#错误码)

## uni 验证码验证文档

> 用途：主要使用在登录、需要人机校验或其他限制调用的场景

> 验证码生成、校验都在服务端。页面使用返回的 base64 显示。[云端一体登陆模板](https://ext.dcloud.net.cn/plugin?id=13)已集成，可下载体验。

> 数据表使用[opendb-verify-codes](https://gitee.com/dcloud/opendb/blob/master/collection/opendb-verify-codes/collection.json)

### 获取验证码@create

用法：`uniCaptcha.create(Object params);`

**参数说明**

| 字段         | 类型    | 必填 | 默认值  | 说明                                                         |
| ------------ | ------- | ---- | ------- | ------------------------------------------------------------ |
| scene        | String  | 是   | -       | 使用场景值，用于防止不同功能的验证码混用，如：`login`、`pay` |
| deviceId     | String  | -    | -       | 设备 id，如果不传，将自动从 uniCloud 上下文获取              |
| width        | Number  | -    | 150     | 图片宽度                                                     |
| height       | Number  | -    | 40      | 图片高度                                                     |
| background   | String  | -    | #FFFAE8 | 验证码背景色，设置空字符`''`不使用背景颜色                   |
| size         | Number  | -    | 4       | 验证码长度，最多 6 个字符                                    |
| noise        | Number  | -    | 4       | 验证码干扰线条数                                             |
| color        | Boolean | -    | false   | 字体是否使用随机颜色，当设置`background`后恒为`true`         |
| fontSize     | Number  | -    | 40      | 字体大小                                                     |
| ignoreChars  | String  | -    | ''      | 忽略那些字符                                                 |
| mathExpr     | Boolean | -    | false   | 是否使用数学表达式                                           |
| mathMin      | Number  | -    | 1       | 表达式所使用的最小数字                                       |
| mathMax      | Number  | -    | 9       | 表达式所使用的最大数字                                       |
| mathOperator | String  | -    | ''      | 表达式所使用的运算符，支持 `+`、`-`。不传随机使用            |
| expiresDate  | Number  | -    | 180     | 验证码过期时间(s)                                            |

**响应参数**

| 字段          | 类型   | 说明                |
| ------------- | ------ | ------------------- |
| code          | Number | 错误码，0 表示成功  |
| message       | String | 详细信息            |
| captchaBase64 | String | 验证码：base64 格式 |

`注意：`

- 重新生成后，上条验证码不作废
- 刷新验证码，上条验证码作废
- 如果想替换字体，请保证字体格式为 `.ttf` 且包含 `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-` 字符

### 校验验证码@verify

用法：`uniCaptcha.verify(Object params);`

**参数说明**

| 字段     | 类型   | 必填 | 默认值 | 说明                                            |
| -------- | ------ | ---- | ------ | ----------------------------------------------- |
| scene    | String | 是   | -      | 类型，用于防止不同功能的验证码混用              |
| captcha  | String | 是   | -      | 验证码                                          |
| deviceId | String | -    | -      | 设备 id，如果不传，将自动从 uniCloud 上下文获取 |

**响应参数**

| 字段    | 类型   | 说明               |
| ------- | ------ | ------------------ |
| code    | Number | 错误码，0 表示成功 |
| message | String | 详细信息           |

`注意：`

- 若提示验证码失效，请重新获取

### 刷新验证码@refresh

用法：`uniCaptcha.refresh(Object params);`

**参数说明**

| 字段     | 类型   | 必填 | 默认值 | 说明                                            |
| -------- | ------ | ---- | ------ | ----------------------------------------------- |
| scene    | String | 是   | -      | 类型，用于防止不同功能的验证码混用              |
| deviceId | String | -    | -      | 设备 id，如果不传，将自动从 uniCloud 上下文获取 |

**响应参数**

| 字段          | 类型   | 说明                |
| ------------- | ------ | ------------------- |
| code          | Number | 错误码，0 表示成功  |
| message       | String | 详细信息            |
| captchaBase64 | String | 验证码：base64 格式 |

`注意：`

- 支持传入 create 方法的所有参数，如果不传，则自动按照 deviceId 匹配上次生成时的配置生成新的验证码

## 错误码

_详细信息请查看 message 中查看_

|  模块  | 模块码 | 错误代码 |        错误信息         |
| :----: | :----: | :------: | :---------------------: |
| 验证码 |  100   |    01    | （10001）验证码生成失败 |
|        |        |    02    | （10002）验证码校验失败 |
|        |        |    03    | （10003）验证码刷新失败 |
