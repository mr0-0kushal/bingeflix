import React from "react";
import { Link } from "react-router-dom";
import google from '/google.png'

function Auth() {
  return (
    <div className="auth-container flex flex-col items-center justify-center h-full w-full gap-6 lg:gap-8">
      <span className="heading text-xl lg:text-3xl font-extrabold">Authentication</span>
      {/* Authentication Buttons */}
      <div className="auth-buttons flex flex-col lg:flex-row gap-6 lg:justify-between w-full justify-center items-center lg:w-[40%]">
        <button className="button_special">
          <Link to="/auth/login" className="w-full">
            <span className="button_lg">
              <span className="button_sl"></span>
              <span className='button_text font-bold'>Login</span>
            </span>
          </Link>
        </button>
        <Link to="/auth/signup">
          <button className="button_special">
            <span className="button_lg">
              <span className="button_sl"></span>
              <span className='button_text font-bold'>SignUp</span>
            </span>
          </button>
        </Link>

      </div>
      {/* OAuth */}
      <span className="heading text-xl lg:text-3xl font-extrabold">OAuth</span>
      <div className="flex flex-col lg:flex-row gap-6 lg:justify-between lg:w-[40%]">
        <button className="button_2">
          <span>Signin with</span>&nbsp;
          <span className='relative'>GitHub</span>
        </button>
        <div className="button_2 text-center">
          <span>Signin with</span>&nbsp;
          <span className="">
            Google
          </span>
        </div>
      </div>
    </div>
  );
}

export default Auth;
