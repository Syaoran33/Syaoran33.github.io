'use strict';

// Pages 的分支部署默认要对仓库跑一次 Jekyll 构建；产物里有 .nojekyll 时
// 会跳过该步骤直接发布，公开仓库也就无需依赖 Actions 构建任务。
hexo.extend.generator.register('nojekyll', () => ({
  path: '.nojekyll',
  data: ''
}));
