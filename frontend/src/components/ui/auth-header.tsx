import { Heading, Image } from '@chakra-ui/react';
import React from 'react';
import ProjektoriumLogo from '@/assets/icons/projektorium-logo-blue.svg';

interface AuthHeaderProps {
  greeting?: string; // Optional greeting message
  title?: string; // Optional title to customize the header
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ greeting = "Witaj", title = "Projektorium" }) => {
  return (
    <Heading className="login-header">
      {greeting} <br />
      <Image
        display="inline-block"
        src={ProjektoriumLogo}
        alt="Logo"
        boxSize="1.5em"
        mr="0.3em"
        verticalAlign="middle"
        height="40px"
        width="auto"
      />
      {title}
    </Heading>
  );
};

export default AuthHeader;