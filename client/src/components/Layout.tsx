import { PropsWithChildren } from 'react';
import Navbar from './Navbar'
import {Wrapper, WrapperVariant} from './Wrapper'

type LayoutProps = {
    variant?:WrapperVariant,
}

export const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({children,variant}) => {
    return (
        <>
        <Navbar/>
        <Wrapper variant={variant}>
            {children}
        </Wrapper>
        </>
        
    )
}