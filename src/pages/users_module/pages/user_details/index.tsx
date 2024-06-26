import React from 'react';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { Fade } from '../../../../motions';
import { UserProvider } from './context';
import UserProfile from './profile';

import './user.scss';

const UserDetails = () => {
  const navigate = useNavigate();
  return (
    <Fade className="flex flex-col gap-6 text-gray">
      <div className="gap-4">
        <button
          className="flex items-center gap-2 cursor-pointer text-gray"
          onClick={() => navigate("/users")}
        >
          <HiOutlineArrowNarrowLeft size={24} />
          Back to Users
        </button>
        <div className="flex items-center justify-between xs-flex-col gap-4">
          {" "}
          <h1>User Details</h1>
          <div className="flex items-center gap-6">
            <button className="text-xs uppercase border-2 border border-red text-red p-3 px-4 rounded">
              Blacklist User
            </button>
            <button className="text-xs uppercase border-2 border border-primary text-primary p-3 px-4 rounded">
              Activate User
            </button>
          </div>
        </div>
      </div>

      <UserProvider>
        <UserProfile />
      </UserProvider>
    </Fade>
  );
};

export default UserDetails;




