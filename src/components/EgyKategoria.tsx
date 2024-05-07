import React, { FC } from 'react';
import { Text } from '@chakra-ui/react';
import { useParams } from "react-router-dom";

export const EgyKategoria: FC = () => {
    const {categoryId} = useParams();

    return (
        <>
            <Text>{categoryId}</Text>
        </>
    );
}