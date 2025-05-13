import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from '@/components/ui/badge';

describe('Badge 组件', () => {
  it('渲染基本徽章', () => {
    render(<Badge>标签</Badge>);
    expect(screen.getByText('标签')).toBeInTheDocument();
  });

  it('应用不同的变体样式', () => {
    const { rerender } = render(<Badge variant="default">默认徽章</Badge>);
    expect(screen.getByText('默认徽章')).toHaveClass('bg-neutral-50');
    expect(screen.getByText('默认徽章')).toHaveClass('text-neutral-800');

    rerender(<Badge variant="primary">主要徽章</Badge>);
    expect(screen.getByText('主要徽章')).toHaveClass('bg-primary-50');
    expect(screen.getByText('主要徽章')).toHaveClass('text-primary-800');

    rerender(<Badge variant="secondary">次要徽章</Badge>);
    expect(screen.getByText('次要徽章')).toHaveClass('bg-secondary-50');
    expect(screen.getByText('次要徽章')).toHaveClass('text-secondary-800');

    rerender(<Badge variant="destructive">危险徽章</Badge>);
    expect(screen.getByText('危险徽章')).toHaveClass('bg-destructive-50');
    expect(screen.getByText('危险徽章')).toHaveClass('text-destructive-800');

    rerender(<Badge variant="success">成功徽章</Badge>);
    expect(screen.getByText('成功徽章')).toHaveClass('bg-success-50');
    expect(screen.getByText('成功徽章')).toHaveClass('text-success-800');

    rerender(<Badge variant="warning">警告徽章</Badge>);
    expect(screen.getByText('警告徽章')).toHaveClass('bg-warning-50');
    expect(screen.getByText('警告徽章')).toHaveClass('text-warning-800');

    rerender(<Badge variant="info">信息徽章</Badge>);
    expect(screen.getByText('信息徽章')).toHaveClass('bg-info-50');
    expect(screen.getByText('信息徽章')).toHaveClass('text-info-800');

    rerender(<Badge variant="outline">轮廓徽章</Badge>);
    expect(screen.getByText('轮廓徽章')).toHaveClass('bg-transparent');
    expect(screen.getByText('轮廓徽章')).toHaveClass('text-neutral-800');
  });

  it('应用不同的尺寸样式', () => {
    const { rerender } = render(<Badge size="sm">小徽章</Badge>);
    expect(screen.getByText('小徽章')).toHaveClass('px-2');
    expect(screen.getByText('小徽章')).toHaveClass('py-0.5');
    expect(screen.getByText('小徽章')).toHaveClass('text-xs');

    rerender(<Badge size="md">中徽章</Badge>);
    expect(screen.getByText('中徽章')).toHaveClass('px-2.5');
    expect(screen.getByText('中徽章')).toHaveClass('py-0.5');
    expect(screen.getByText('中徽章')).toHaveClass('text-xs');

    rerender(<Badge size="lg">大徽章</Badge>);
    expect(screen.getByText('大徽章')).toHaveClass('px-3');
    expect(screen.getByText('大徽章')).toHaveClass('py-1');
    expect(screen.getByText('大徽章')).toHaveClass('text-sm');
  });

  it('渲染带图标的徽章', () => {
    const icon = <span data-testid="test-icon">图标</span>;
    render(<Badge icon={icon}>带图标徽章</Badge>);
    
    expect(screen.getByText('带图标徽章')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByTestId('test-icon').parentElement).toHaveClass('mr-1');
  });

  it('渲染可移除的徽章', () => {
    render(<Badge removable>可移除徽章</Badge>);
    expect(screen.getByText('可移除徽章')).toBeInTheDocument();
    const badgeElement = screen.getByText('可移除徽章').closest('div');
    expect(badgeElement).toHaveClass('pr-1');
  });

  it('点击移除按钮时调用onRemove回调', () => {
    const handleRemove = jest.fn();
    render(<Badge onRemove={handleRemove}>可移除徽章</Badge>);
    
    const removeButton = screen.getByRole('button', { name: '移除' });
    expect(removeButton).toBeInTheDocument();
    
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('阻止移除按钮点击事件冒泡', () => {
    const handleRemove = jest.fn();
    const handleClick = jest.fn();
    
    render(
      <Badge onRemove={handleRemove} onClick={handleClick}>
        可移除徽章
      </Badge>
    );
    
    const removeButton = screen.getByRole('button', { name: '移除' });
    fireEvent.click(removeButton);
    
    expect(handleRemove).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('当设置interactive为true时应用交互样式', () => {
    render(<Badge interactive>交互式徽章</Badge>);
    expect(screen.getByText('交互式徽章')).toHaveClass('cursor-pointer');
    expect(screen.getByText('交互式徽章')).toHaveClass('transition-colors');
  });

  it('当有onRemove回调时自动设置为interactive', () => {
    const handleRemove = jest.fn();
    render(<Badge onRemove={handleRemove}>可移除徽章</Badge>);
    
    expect(screen.getByText('可移除徽章')).toHaveClass('cursor-pointer');
    expect(screen.getByText('可移除徽章')).toHaveClass('transition-colors');
  });

  it('接受并应用自定义类名', () => {
    render(<Badge className="custom-class">自定义类名徽章</Badge>);
    expect(screen.getByText('自定义类名徽章')).toHaveClass('custom-class');
  });
});
