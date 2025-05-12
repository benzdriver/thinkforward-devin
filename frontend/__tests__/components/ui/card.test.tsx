import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../../components/ui/card';

describe('Card 组件', () => {
  it('渲染基本卡片', () => {
    render(<Card>卡片内容</Card>);
    expect(screen.getByText('卡片内容')).toBeInTheDocument();
  });

  it('应用不同的变体样式', () => {
    const { rerender } = render(<Card variant="default">默认卡片</Card>);
    expect(screen.getByText('默认卡片')).toHaveClass('border-secondary-200');

    rerender(<Card variant="feature">特色卡片</Card>);
    expect(screen.getByText('特色卡片')).toHaveClass('border-primary-100');

    rerender(<Card variant="destructive">危险卡片</Card>);
    expect(screen.getByText('危险卡片')).toHaveClass('border-destructive-100');
  });

  it('应用悬停效果', () => {
    render(<Card hover={true}>悬停卡片</Card>);
    expect(screen.getByText('悬停卡片')).toHaveClass('transition-shadow');
    expect(screen.getByText('悬停卡片')).toHaveClass('hover:shadow-md');
  });

  it('渲染卡片头部', () => {
    render(<CardHeader>卡片头部</CardHeader>);
    expect(screen.getByText('卡片头部')).toBeInTheDocument();
    expect(screen.getByText('卡片头部')).toHaveClass('p-6');
  });

  it('渲染卡片标题', () => {
    render(<CardTitle>卡片标题</CardTitle>);
    expect(screen.getByText('卡片标题')).toBeInTheDocument();
    expect(screen.getByText('卡片标题')).toHaveClass('font-semibold');
    expect(screen.getByText('卡片标题')).toHaveClass('text-lg');
  });

  it('渲染卡片内容', () => {
    render(<CardContent>卡片内容</CardContent>);
    expect(screen.getByText('卡片内容')).toBeInTheDocument();
    expect(screen.getByText('卡片内容')).toHaveClass('p-6');
    expect(screen.getByText('卡片内容')).toHaveClass('pt-0');
  });

  it('渲染卡片底部', () => {
    render(<CardFooter>卡片底部</CardFooter>);
    expect(screen.getByText('卡片底部')).toBeInTheDocument();
    expect(screen.getByText('卡片底部')).toHaveClass('p-6');
    expect(screen.getByText('卡片底部')).toHaveClass('pt-0');
  });

  it('接受并应用自定义类名', () => {
    render(<Card className="custom-class">自定义类名卡片</Card>);
    expect(screen.getByText('自定义类名卡片')).toHaveClass('custom-class');
  });

  it('组合使用所有卡片子组件', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>完整卡片标题</CardTitle>
        </CardHeader>
        <CardContent>完整卡片内容</CardContent>
        <CardFooter>完整卡片底部</CardFooter>
      </Card>
    );
    
    expect(screen.getByText('完整卡片标题')).toBeInTheDocument();
    expect(screen.getByText('完整卡片内容')).toBeInTheDocument();
    expect(screen.getByText('完整卡片底部')).toBeInTheDocument();
  });
});
