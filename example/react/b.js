import React, { Component } from 'react'
import { render } from 'react-dom'
import styled, { injectGlobal }  from 'styled-components'
import { Button as BButton } from 'react-bootstrap'

// https://www.codecamps.com/a-quick-guide-to-styled-components-with-interactive-examples/
// https://www.styled-components.com/docs/basics
const ccccccccccc = ['#fff', 'rgba(0,0,0,0)']
injectGlobal`
  :root {
    --violet: #5e1fe4;
    --gray: #808080;
  }
  body {
    background-color: var(--gray);
    font-size: 14px;
    font-family: "Lato";
  }
`
const Wrapper = styled.div`
  display: grid;
  grid-gap: 5px;
  grid-template-rows: auto;
  padding: 10px;
  background: lightgray;
  border-radius: 10px;
`
const Row = styled.div`
  min-height: 130px;
  margin: 10px;
  padding: 5px;
  background: ivory;
  border-radius: 7px;
`
const OnlyStyledButton = styled.button`
  height: 40px;
  width: 150px;
  margin: 1px;
  box-shadow: 2px 2px 2px #e3e3e3;
  &:focus {
    outline: none;
  }
  &:active {
    background: #d4886a;
  }
  &:hover {
    border: none;
  }
  color: ${props => props.primary ? 'color: #042037' : '#ffc2aa'}  
  background: ${props => props.primary ? '#ffc2aa' : '#042037'};
  border: ${props => props.primary ? '2px solid #042037' : '2px solid #ffc2aa'}
`
const AnotherStyledButton = styled.button`
  background: ${props => (props.isActive ? "var(--violet)" : "transparent")};
  box-shadow: 0 22px 44px 0 var(--gray);
  border: 2px solid var(--violet);
  color: ${props => (props.isActive ? "white" : "var(--violet)")};
  cursor: pointer;
  font-size: 14px;
  margin: 0 auto;
  padding: 10px 0;
  width: 120px;

  &:hover {
    background: var(--violet);
    color: white;
  }

  &:focus {
    outline: none;
  }
`
class Button extends Component {
  render() {
    return (
      <button className={this.props.className}>
        {this.props.title}
      </button>
    )
  }
}
const StyledButton = styled(Button)`
  color: palevioletred;
	font-size: 1em;
	margin: 1em;
	padding: 0.25em 1em;
	border: 2px solid palevioletred;
	border-radius: 3px;
`
const ExtendedStyledButton = StyledButton.extend`
  color: tomato;
  border-color: tomato;
`
const StyledBButton = styled(BButton) `
  color: palevioletred;
	font-size: 1em;
	margin: 1em;
	padding: 0.25em 1em;
	border: 2px solid palevioletred;
	border-radius: 3px;
`
const StyledPanel = styled.section`
  padding: 3em;
  background: papayawhip;
  ${p => p.css};
`
const StyledTitle = styled.h3`
  background-color: ${props =>
  props.colorful ? 'lightblue' : 'red'
}
  color: ${props =>
{ if (props.boy) return 'green'; else if (props.girl) return 'blue' }
}
  font-family: ${props => props.colorful ? 'impact' : 'serif'}
`

const App = () =>
  <Wrapper>
    <h1>Styled Components</h1>
    <Row>
      <h2>Component without style</h2>
      <Button title={'just a button'} />
    </Row>
    <Row>
      <h2>Only styled, without component</h2>
      <OnlyStyledButton>styled button</OnlyStyledButton>
      {' '}
      <OnlyStyledButton primary>another styled button</OnlyStyledButton>
      {' '}
      <AnotherStyledButton>css properties</AnotherStyledButton>
    </Row>
    <Row>
      <h2>Own component with style</h2>
      <StyledButton title={'button & style'} />
      <ExtendedStyledButton title={'extended style'} />
    </Row>
    <Row>
      <h2>External (Bootstrap) component with style</h2>
      <h4>(requires including bootstrap css)</h4>
      <StyledBButton>Bootstrap button</StyledBButton>
    </Row>
    <Row>
      <StyledPanel css={{ ':hover': { background: '#00FFFF' } }}>
        <h2>Pass CSS from JSX</h2>
      </StyledPanel>
    </Row>
    <Row>
      <h2>With props</h2>
      <StyledTitle colorful boy>Hi Joey</StyledTitle>
      <StyledTitle colorful boy>Hi Chandler</StyledTitle>
      <StyledTitle colorful girl>Hi Monica</StyledTitle>
      <StyledTitle>Hi Phoebe</StyledTitle>
    </Row>
  </Wrapper>

render(<App />, document.getElementById('root'))
