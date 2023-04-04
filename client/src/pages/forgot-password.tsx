import { Flex, Button,Box } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import router from 'next/router'
import React, { useState } from 'react'
import InputField from '../components/InputField'
import {Wrapper} from '../components/Wrapper'
import { useForgotPasswordMutation } from '../gql/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'
import { toErrorMap } from '../utils/toErrorMap'


const ForgotPassword:React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false)
    const [,forgotPassword] = useForgotPasswordMutation()
  
    return (
    <Wrapper variant='small'>
    <Formik
        initialValues={{email:''}}
        onSubmit={async (values)=>{
            await forgotPassword(values)
            setComplete(true)
        }}
    >
        {({isSubmitting})=> complete ? 
        (
            <Box>If an account with that email exists, we sent you an email</Box>
        )
        :
        (
        <Form>
            <Box mt={2}>
            <InputField name="email"
            placeholder="email"
            label="Email"
            type='email'/>
            </Box>
            <Button mt={4} colorScheme='teal' type="submit"
            isLoading={isSubmitting}
            >Forgot Password</Button>
        </Form>
    )}
    </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)