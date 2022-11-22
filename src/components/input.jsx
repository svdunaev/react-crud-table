import styled from 'styled-components';

export const Input = styled.input`
	font-family: var(--family);
	line-height: 1.15em;
	text-align: center;
	
	padding: 0.7em 0.5em;
	border-radius: var(--radius);

	&:disabled {
		color: var(--colors-text);
	}
`;