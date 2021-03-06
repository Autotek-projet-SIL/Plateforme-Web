import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  background: #eff2ef;
  height: 60px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  z-index: 10;
  width: 100vw;
  box-sizing: border-box;
  margin-bottom: 20px;
`;

export const NavLink = styled(Link)`
  color: #042a2b;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;
  font-weight: bold;
  font-family: "Sora", sans-serif;

  &.active {
    color: #042a2b;
    text-transform: capitalize;
    text-decoration: underline;
    text-decoration-thickness: 3px;
    text-underline-position: under;
  }

  &.hover {
    color: #042a2b;
    text-decoration: underline #042a2b solid 5px;
  }
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  font-size: 1rem;
  @media screen and (max-width: 700px) {
    font-size: 0.7rem;
  }
`;

export const NavBtn = styled.nav`
 

 

  
  }
`;
