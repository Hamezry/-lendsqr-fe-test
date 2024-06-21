import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { mockMatchMedia } from '@/__mocks__/matchMedia';
import { nextNavigationWrapper } from '@/__tests__/wrapper';
import { createColumnHelper } from '@tanstack/react-table';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Table from '.';

beforeEach(() => {
  mockMatchMedia();
});

afterEach(cleanup);

describe('TESTING TABLE', () => {
  it('should render the loading state', () => {
    render(
      <Table
        status="pending"
        columns={columns}
        data={empty}
        title="Persona Table"
      />,
      { wrapper: nextNavigationWrapper },
    );

    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('should render the error state', () => {
    render(
      <Table
        status="error"
        columns={columns}
        data={empty}
        title="Persona Table"
      />,
      { wrapper: nextNavigationWrapper },
    );
    expect(screen.getByText(/Error loading data/i)).toBeInTheDocument();
  });

  it('should render when the data is empty', () => {
    render(
      <Table
        status="success"
        columns={columns}
        data={empty}
        title="Persona Table"
      />,
      { wrapper: nextNavigationWrapper },
    );
    expect(
      screen.getByRole('img', { name: /No records found/i }),
    ).toBeInTheDocument();
  });

  it('should render when the data is not empty', () => {
    render(
      <Table
        status="success"
        columns={columns}
        data={people}
        title="Persona Table"
      />,
      { wrapper: nextNavigationWrapper },
    );

    expect(screen.getByText(/Green/i)).toBeInTheDocument();
  });

  it.skip('should hide columns', () => {
    const user = userEvent.setup();

    render(
      <Table
        status="success"
        columns={columns}
        data={people}
        title="Persona Table"
      />,
      { wrapper: nextNavigationWrapper },
    );
    const columnBtn = screen.getByRole('button', {
      name: /column visibility/i,
    });

    expect(columnBtn).not.toBeDisabled();

    user.click(columnBtn);

    expect(
      screen.getByRole('checkbox', { name: /First name/i }),
    ).toBeInTheDocument();
  });
});

interface Person {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  id: string;
}

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor('id', {
    header: () => 'Persona ID',
  }),
  columnHelper.accessor('first_name', {
    header: () => 'First Name',
    id: 'First Name',
  }),
  columnHelper.accessor('last_name', {
    header: () => 'Last Name',
  }),
  columnHelper.accessor('email', {
    header: () => 'Email Address',
  }),
  columnHelper.accessor('role', {
    header: () => 'Role',
  }),
  columnHelper.accessor('id', {
    header: () => 'Action',
  }),
];

const empty: Array<Person> = [];

const people: Array<Person> = [
  {
    id: '1',
    first_name: 'Green',
    last_name: 'Onyeji',
    email: 'onyeji@gmail.com',
    role: 'admin',
    phone_number: '+2347011056442',
  },
];
