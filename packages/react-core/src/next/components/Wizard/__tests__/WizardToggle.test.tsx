import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { KeyTypes } from '../../../../helpers';
import { WizardToggle, WizardToggleProps } from '../WizardToggle';

const steps = [
  { id: 'id-1', name: 'First step', component: <>First step content</> },
  { id: 'id-2', name: 'Second step', component: <>Second step content</> }
];

const defaultProps: WizardToggleProps = {
  steps,
  currentStep: steps[0],
  footer: <div>Some footer</div>,
  nav: <div>Some nav</div>,
  'aria-label': 'Some label'
};

test('renders provided footer, nav, and current step content', () => {
  render(<WizardToggle {...defaultProps} />);

  expect(screen.getByText('Some footer')).toBeVisible();
  expect(screen.getByText('Some nav')).toBeVisible();
  expect(screen.getByText('First step content')).toBeVisible();
});

test('applies aria-label to the expandable toggle button when specified', () => {
  render(<WizardToggle {...defaultProps} aria-label="Some label" />);
  expect(screen.getByRole('button', { name: 'Some label' })).toBeVisible();
});

test('has expanded properties when isNavExpanded is true', async () => {
  render(<WizardToggle {...defaultProps} aria-label="Some label" isNavExpanded />);

  const toggleButton = screen.getByRole('button', { name: 'Some label' });

  expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  expect(toggleButton).toHaveClass('pf-m-expanded');
});

test('calls toggleNavExpanded on toggle button click', async () => {
  const toggleNavExpanded = jest.fn();
  const user = userEvent.setup();

  render(<WizardToggle {...defaultProps} aria-label="Some label" toggleNavExpanded={toggleNavExpanded} />);

  await user.click(screen.getByRole('button', { name: 'Some label' }));
  expect(toggleNavExpanded).toHaveBeenCalled();
});

test('renders only the active step content by default', async () => {
  render(<WizardToggle {...defaultProps} />);

  expect(screen.getByText('First step content')).toBeInTheDocument();
  expect(screen.queryByText('Second step content')).toBeNull;
});

test('renders all step content when hasUnmountedSteps is false', async () => {
  render(<WizardToggle {...defaultProps} hasUnmountedSteps={false} />);

  expect(screen.getByText('First step content')).toBeInTheDocument();
  expect(screen.getByText('Second step content')).toBeInTheDocument();
});

test('has expanded properties when the toggle dropdown button is clicked', async () => {
  const user = userEvent.setup();

  render(<WizardToggleExpand aria-label="Some label" />);

  const toggleButton = screen.getByRole('button', { name: 'Some label' });

  expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  expect(toggleButton).not.toHaveClass('pf-m-expanded');

  await user.click(toggleButton);

  expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  expect(toggleButton).toHaveClass('pf-m-expanded');
});

test('unsets expanded properties when using the Escape key', async () => {
  const user = userEvent.setup();

  render(<WizardToggleExpand aria-label="Some label" />);

  const toggleButton = screen.getByRole('button', { name: 'Some label' });

  await user.click(toggleButton);

  expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  expect(toggleButton).toHaveClass('pf-m-expanded');

  await user.type(toggleButton, `{${KeyTypes.Escape}}`);

  expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  expect(toggleButton).not.toHaveClass('pf-m-expanded');
});

const WizardToggleExpand = props => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <WizardToggle
      {...defaultProps}
      isNavExpanded={isExpanded}
      toggleNavExpanded={() => setIsExpanded(!isExpanded)}
      {...props}
    />
  );
};
