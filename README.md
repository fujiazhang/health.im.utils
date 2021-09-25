# health.im.utils


### 安装

```
npm i git+ssh://git@code.aliyun.com:healthv2/health.utils.git --save
```
```
指定对应git tag
npm   git+ssh://git@code.aliyun.com:healthv2/health.utils.git#v1.1.9 --save
```

### 使用

```
import ImSDKUtils from '@health/utils';

const utils = new ImSDKUtils({
  getToken: () => getAccessToken() || '',
  prefix: '/api'
})
```



