import React from "react";
import styled from 'styled-components'

const CreateTopicFields = ({ onChange, widthCalc, inputWidth, defaultValue, disabled }) => {

    return (
        <CreateTopicFieldsWrapper widthCalc={widthCalc}>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='0' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[0]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='1' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[1]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='2' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[2]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='3' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[3]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='4' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[4]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='5' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[5]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='6' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[6]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='7' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[7]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='8' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[8]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='9' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[9]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='10' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[10]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='11' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[11]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='12' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[12]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='13' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[13]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='14' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[14]}/>
            <StyledInput disabled={disabled} inputWidth={inputWidth} id='15' onChange={onChange} autoComplete="off" defaultValue={defaultValue.topic[15]}/>
        </CreateTopicFieldsWrapper>
    )
}
const CreateTopicFieldsWrapper = styled.div`
    width: ${props => props.widthCalc};
    margin: 0 auto 0 auto;
`
const StyledInput = styled.input`
    width: ${props => props.inputWidth};
    height: 10vh;
    font-size: 24px;
    padding: 0;
    text-align: center;
    border: 1px solid gray;

    &:focus {
        outline: none;
    }
    &:disabled {
        cursor: default;
        background-color: transparent;
        color: black
    }
`

export default CreateTopicFields