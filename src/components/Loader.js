import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Loader = ({ name, seconds }) => {

    // const tX = ['-375px', '-325px', '-275px', '-225px', '-175px', '-125px', '-75px', '-25px', '25px', '75px', '125px', '175px', '225px', '275px', '325px', '375px' ]
    const tX30 = ['-391px', '-364px', '-337px', '-310px', '-283px', '-256px', '-229px', '-202px', '-175px', '-148px', '-121px', '-94px', '-67px', '-40px', '-13px', '14px', '41px', '68px', '95px', '122px', '149px', '176px', '203px', '230px', '257px', '284px', '311px', '338px', '365px', '392px']
    const tX45 = ['-396px', '-378px', '-360px', '-342px', '-324px', '-306px', '-288px', '-270px', '-252px', '-234px', '-216px', '-198px', '-180px', '-162px', '-144px', '-126px', '-108px', '-90px', '-72px', '-54px', '-36px', '-18px', '0px', '18px', '36px', '54px', '72px', '90px', '108px', '126px', '144px', '162px', '180px', '198px', '216px', '234px', '252px', '270px', '288px', '306px', '324px', '342px', '360px', '378px', '396px']

    const [test, setTest] = useState([])

    let backWidth = Math.round(800/seconds) * seconds
    let loadingWidth = Math.round(800/seconds)

    let testArray = []

    useEffect(() => {
        console.log(tX45.length)
        tX45.map( (x, y) => {
            let timeout = setTimeout(() => {
                testArray.push(
                    <LoadingColor
                        loadingWidth={`${loadingWidth}px`}
                        borderStart={ y === 0 }
                        borderEnd={ y === tX45.length - 1 }
                        key={y}
                        tX={x} />
                )
                setTest(testArray)
                if(y === seconds) return () => clearTimeout(timeout)
            }, 1000 * y + 1)        
        })  
    }, [name, seconds])

    return (
        <Container backWidth={`${backWidth}px`} >
            <Text fontSize='22px' color='white'>{name}</Text>
            {test.map( x => {return x})}
            {/* <LoadingColor borderStart tX='-375px' />
            <LoadingColor tX='-325px' />
            <LoadingColor tX='-275px' />
            <LoadingColor tX='-225px' />
            <LoadingColor tX='-175px' />
            <LoadingColor tX='-125px' />
            <LoadingColor tX='-75px' />
            <LoadingColor tX='-25px' />
            <LoadingColor tX='25px' />
            <LoadingColor tX='75px' />
            <LoadingColor tX='125px' />
            <LoadingColor tX='175px' />
            <LoadingColor tX='225px' />
            <LoadingColor tX='275px' />
            <LoadingColor tX='325px' />
            <LoadingColor borderEnd tX='375px' /> */}
            <BackgroundColor backWidth={`${backWidth}px`} />
        </Container>
    )
}

const Container = styled.div`
    width: ${props => props.backWidth && props.backWidth};
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid gray;
    border-radius: 8px;
    margin: 50px 0 50px 0;
`
const Text = styled.span`
    display: block;
    position: absolute;
    z-index: 1;
    font-size: ${props => props.fontSize && props.fontSize};
    color: ${props => props.color && props.color};
    margin: ${props => props.margin};
    white-space: pre-wrap;    
    padding: ${props => props.padding && props.padding}
`
const LoadingColor = styled.div`
    width: ${props => props.loadingWidth && props.loadingWidth};
    height: 50px;
    position: absolute;
    transform: translate(${props => props.tX && props.tX}, 0);
    ${props => props.borderStart && 'border-radius: 8px 0 0 8px;'}
    ${props => props.borderEnd && 'border-radius: 0 8px 8px 0;'}
    background-color: blue;
    
`
const BackgroundColor = styled.div`
    width: ${props => props.backWidth && props.backWidth};
    height: 50px;
    border-radius: 8px;
    background-color: gray;    
`
export default Loader