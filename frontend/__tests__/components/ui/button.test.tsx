import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../../../components/ui/button';

describe('Button 组件', () => {
  it('渲染按钮文本', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });

  it('点击时调用 onClick 处理函数', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>点击我</Button>);
    fireEvent.click(screen.getByText('点击我'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('禁用状态下不可点击', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>点击我</Button>);
    fireEvent.click(screen.getByText('点击我'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('应用不同的变体样式', () => {
    const { rerender } = render(<Button variant="primary">主要按钮</Button>);
    expect(screen.getByText('主要按钮')).toHaveClass('bg-primary-500');

    rerender(<Button variant="secondary">次要按钮</Button>);
    expect(screen.getByText('次要按钮')).toHaveClass('bg-secondary-500');

    rerender(<Button variant="destructive">危险按钮</Button>);
    expect(screen.getByText('危险按钮')).toHaveClass('bg-destructive-500');
  });

  it('应用不同的尺寸样式', () => {
    const { rerender } = render(<Button size="sm">小按钮</Button>);
    expect(screen.getByText('小按钮')).toHaveClass('px-3 py-1 text-sm');

    rerender(<Button size="md">中按钮</Button>);
    expect(screen.getByText('中按钮')).toHaveClass('px-4 py-2');

    rerender(<Button size="lg">大按钮</Button>);
    expect(screen.getByText('大按钮')).toHaveClass('px-6 py-3 text-lg');
  });
});
