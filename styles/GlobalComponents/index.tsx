import styled from "@emotion/styled"
import { breakpoints } from "../breakpoints"

/* Used for Btn and SectionTitle */
type ColorProps = {
  color?: string
  bgColor?: string
  hoverColor?: string
}

export const BtnWide = styled.button<ColorProps>`
  width: 100%;
  cursor: pointer;
  background-color: ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
  border: 2px solid ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  border-radius: 0.5rem;
  margin: 1rem 0;
  padding: 0.4rem 0.5rem;
  color: #fff;
  font-size: 0.875rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  line-height: 1.5;
  font-family: var(--font-primary);
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;

  @media ${breakpoints.md} {
    font-size: 1.25rem;
  }

  :disabled {
    cursor: wait;
    background: linear-gradient(180deg, #fff, #777);
    border: 2px solid #999;
    color: #555;
  }

  :focus {
    outline: 2px solid ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
    box-shadow: 0 0 0 0.1rem ${props => (props.bgColor ? `${props.bgColor}` : "var(--primary)")};
  }

  :hover {
    background-color: transparent;
    color: ${props => (props.hoverColor ? `${props.hoverColor}` : props.bgColor ? `${props.bgColor}` : "var(--primary)")};
  }
`
export const Display = styled.h2`
  line-height: 1.1;
  font-size: 2rem;
  padding: 1.25rem 0;
  text-align: center;
  max-width: 500px;
  margin: 0 auto;

  @media ${breakpoints.xs} {
    padding-top: 1.65rem;
    font-size: 2.75rem;
  }

  @media ${breakpoints.md} {
    padding-top: 2rem;
    font-size: 2.75rem;
  }
`

export const FormControl = styled.div`
  //border: 1px solid var(--secondary);
  border-radius: 0.5rem;
  margin: 0.5rem auto;
  padding: 0.35rem 0.25rem;
  color: var(--primary);
  font-weight: bold;
  position: relative;
  z-index: 2;

  input {
    padding: 0.6rem 0.5rem;
  }

  label {
    font-size: 0.675rem;
    padding: 0;
    color: var(--primary);

    @media ${breakpoints.xs} {
      font-size: 0.875rem;
    }

    @media ${breakpoints.md} {
      font-size: 1rem;
    }
  }

  textarea {
    line-height: 1.75;
    resize: none;
  }

  select {
    padding: 0.75rem 0;
  }

  input,
  textarea,
  select {
    margin-top: 0.5rem;
    min-width: 160px;
    width: 100%;
    position: relative;
    z-index: 2;
    border-radius: 0.5rem;
    border: 2px solid var(--secondary);

    @media ${breakpoints.sm} {
      min-width: 275px;
    }

    :focus {
      outline: 1px solid var(--secondary);
    }
    :active {
      outline: 1px solid var(--secondary);
    }
  }
`

type HighlightProps = {
  color1?: string
  color2?: string
}

export const Highlight = styled.span<HighlightProps>`
  background-image: linear-gradient(270deg, ${props => (props.color2 ? props.color2 : "#f46737")} 0%, ${props => (props.color1 ? props.color1 : "#f437de")} 100%);
  //background-image: linear-gradient(270deg, #f46737 0%, #f437de 100%);
  background-size: 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
  padding: 0 0.5rem;

  @media ${breakpoints.xs} {
    //font-size: 5rem;
  }
  @media ${breakpoints.sm} {
    //font-size: 6rem;
  }
`

export const SectionVeryNarrow = styled.section`
  padding: 1rem;
  margin: 0.5rem auto;
  width: 100%;
  max-width: 500px;
  border: 3px solid var(--tertiary);
  //background: var(--transparent-dark);
  border-radius: 10px;
`

export const TitleArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  @media ${breakpoints.sm} {
    flex-direction: row;
  }
`

export const WrapperNarrow = styled.div`
  max-width: var(--wrapper-width-narrow);
  margin: 0 auto;
`
