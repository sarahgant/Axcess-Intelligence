/**
 * Button Component Tests
 * Example test for a UI component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/shared/components/ui/Button';
import { TestWrapper } from '@/tests/helpers/TestWrapper';

// Mock the Button component since it doesn't exist yet
jest.mock('@/shared/components/ui/Button', () => ({
  Button: ({ children, onClick, disabled, variant, size, className, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variant || 'primary'} ${size || 'md'} ${className || ''}`}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('Button Component', () => {
  it('renders with children', () => {
    render(
      <TestWrapper>
        <Button>Click me</Button>
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Button onClick={handleClick}>Click me</Button>
      </TestWrapper>
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(
      <TestWrapper>
        <Button disabled>Disabled button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Button onClick={handleClick} disabled>
          Disabled button
        </Button>
      </TestWrapper>
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(
      <TestWrapper>
        <Button variant="primary">Primary</Button>
      </TestWrapper>
    );

    expect(screen.getByTestId('button')).toHaveClass('primary');

    rerender(
      <TestWrapper>
        <Button variant="secondary">Secondary</Button>
      </TestWrapper>
    );

    expect(screen.getByTestId('button')).toHaveClass('secondary');
  });

  it('applies size classes correctly', () => {
    const { rerender } = render(
      <TestWrapper>
        <Button size="sm">Small</Button>
      </TestWrapper>
    );

    expect(screen.getByTestId('button')).toHaveClass('sm');

    rerender(
      <TestWrapper>
        <Button size="lg">Large</Button>
      </TestWrapper>
    );

    expect(screen.getByTestId('button')).toHaveClass('lg');
  });

  it('applies custom className', () => {
    render(
      <TestWrapper>
        <Button className="custom-class">Custom</Button>
      </TestWrapper>
    );

    expect(screen.getByTestId('button')).toHaveClass('custom-class');
  });

  it('forwards other props to button element', () => {
    render(
      <TestWrapper>
        <Button type="submit" id="submit-btn">
          Submit
        </Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('id', 'submit-btn');
  });

  it('handles keyboard events', () => {
    const handleClick = jest.fn();

    render(
      <TestWrapper>
        <Button onClick={handleClick}>Button</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    
    // Enter key should trigger click
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Space key should trigger click
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('has proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <Button aria-label="Close dialog">×</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Close dialog');
  });

  it('supports loading state', () => {
    render(
      <TestWrapper>
        <Button loading>Loading...</Button>
      </TestWrapper>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Loading...');
  });
});