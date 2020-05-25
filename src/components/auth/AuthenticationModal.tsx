import React from "react";
import styled from "@emotion/styled";

export default function AuthenticationModal() {
  return (
    <Container>
      {/* <div className="form-container sign-up-container">
        
      </div>
      <div className="form-container sign-in-container">
        <form onSubmit={this.signIn}>
          <h1>Sign in</h1>
          <div className="social-container">
            <a href="/api/auth/google" className="social">
              <i className="fab fa-google-plus-g"></i>
            </a>
            <a href="/api/auth/facebook" className="social">
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
          <span>or use your account</span>
          <input
            name="username"
            type="text"
            autoComplete="username email"
            spellCheck="false"
            value={this.state.email}
            onChange={e => {
              this.setState({ email: e.target.value, signInError: null });
            }}
            placeholder="Email"
          />
          <input
            name="password"
            type="password"
            spellCheck="false"
            autoComplete="password"
            value={this.state.password}
            onChange={e => {
              this.setState({ password: e.target.value, signInError: null });
            }}
            placeholder="Password"
          />
          <button className="signIn">Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn" onClick={this.signInClick}>
              Sign In
            </button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" id="signUp" onClick={this.signUpClick}>
              Sign Up
            </button>
          </div>
        </div>
      </div> */}
    </Container>
  );
}

const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
  z-index: 2;
`;
