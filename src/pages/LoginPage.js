import React, { useEffect } from 'react'
import styled from 'styled-components'

import Button from '../components/fragments/Button'

import { useApplicationDispatch, useApplicationStore } from '../store/application/useApplicationStore'

const LoginPage = () => {
    const applicationDispatch = useApplicationDispatch()
    const { masterData } = useApplicationStore()

    const onSubmitHandler = event => {
        event.preventDefault()

        if(event.target[0].value === masterData.admin) {
            applicationDispatch({ type: 'set-logged', payload: true })
            applicationDispatch({ type: 'set-page', payload: 'gameSelection' })
        } else {
            alert('Zajebao si password, proveri ga!')
        }

    }

    return (
        <LoginPageWrapper>
            <FormWrapper onSubmit={onSubmitHandler}>
                <StyledInput
                    type={'password'}
                    placeholder='Password'
                />
                <Button
                    type='submit'
                    color='blue'
                    label='Login'
                />
            </FormWrapper>
        </LoginPageWrapper>
    )  
}

const LoginPageWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
`
const FormWrapper = styled.form`
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`
const StyledInput = styled.input`
    width: 200px;
    height: 40px;
    padding-left: 10px;
    border: 1px solid gray;
    border-radius: 5px
`

export default LoginPage;