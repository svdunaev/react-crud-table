import styled from 'styled-components';

export const Button = styled.button`
	font-family: var(--family);
	color: var(--colors-text);
	line-height: 1.5em;
	padding: 0.7em 0.5em;

	border: none;
	background: var(--colors-ui-accent);
	border-radius: var(--radius);

	width: 120px;

	&:disabled {
		background: var(--colors-ui-base);
	}

	&.base {
		background: var(--colors-ui-base);
	}

	&:hover {
		box-shadow: var(--shadow);
	}

	&.add {
		display: block;
		margin: 50px auto;
	}
`;