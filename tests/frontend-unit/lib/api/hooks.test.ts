// Split into separate test files to completely isolate tests
// This file only tests the cache configuration

import { cacheConfig } from '../../mocks/api-hooks';

describe('Cache Configuration Tests', () => {
  it('应该有不同的缓存配置', () => {
    expect(cacheConfig.short.staleTime).toBeLessThan(cacheConfig.medium.staleTime);
    expect(cacheConfig.medium.staleTime).toBeLessThan(cacheConfig.long.staleTime);
    expect(cacheConfig.long.staleTime).toBeLessThan(cacheConfig.persistent.staleTime);
  });
});
