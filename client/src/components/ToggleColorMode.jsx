import { useColorMode } from '@chakra-ui/color-mode'
import { Button } from '@chakra-ui/button';
import {MoonIcon, SunIcon} from "@chakra-ui/icons"
import React from 'react'
import { useLocation } from "react-router-dom";

export const ToggleColorMode = () => {
    const {colorMode, toggleColorMode} = useColorMode();
    const location = useLocation();
    const isHomePage = location.pathname === "/";
  return (
    <Button onClick={() => toggleColorMode()} 
    pos="absolute" 
    top="1" 
    left={isHomePage ? "1" : "100"}
    m="rrem"
    >
        {colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};
