import { Box, Button, Flex } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import router, { useRouter } from 'next/router'
import React, { useState } from 'react'
import InputField from '../../components/InputField'
import {Wrapper} from '../../components/Wrapper'
import { useChangePasswordMutation } from '../../gql/graphql'
import { createUrqlClient } from '../../utils/createUrqlClient'
import { toErrorMap } from '../../utils/toErrorMap'
import NextLink from 'next/link'

const ChangePassword:NextPage<{token:string}> = () => {
    const router = useRouter()
    const [,changePassword] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState("")

  return (
    <Wrapper variant='small'>
    <Formik
        initialValues={{newPassword:""}}
        onSubmit={async (values,{setErrors})=>{
            const response= await changePassword({
                newPassword:values.newPassword,token:typeof router.query.token === 'string' ?router.query.token : ""
            })
            if(response.data?.changePassword.errors){
                const errorMap = toErrorMap(response.data.changePassword.errors)
                if('token' in errorMap){
                    setTokenError(errorMap.token)
                }
                setErrors(errorMap)
            }else if(response.data?.changePassword.user){
                router.push("/")
            }
        }}
    >
        {({isSubmitting})=>(
        <Form>
            <InputField name="newPassword"
            placeholder="new password"
            label="New Password"
            type="password"
            />
            {tokenError?(
            <Flex>
                <Box mr={2} color='red'>{tokenError}</Box>
                <NextLink href='/forgot-password'><Box>Click here to get a new one</Box></NextLink>
            </Flex>
            ):null}
            <Button mt={4} colorScheme='teal' type="submit"
            isLoading={isSubmitting}
            >Change Password</Button>
        </Form>
    )}
    </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(ChangePassword)