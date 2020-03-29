import styled from 'styled-components'
import {PRIMARY, SECONDARY} from './Constants';


const Header = styled.div`
  background: linear-gradient(${PRIMARY}, ${SECONDARY});
  height: 100px !important;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align: center;
  width: 100%;
  font-weight:bold;
  color: white;
  font-size: 30px;
`;

export default Header;
