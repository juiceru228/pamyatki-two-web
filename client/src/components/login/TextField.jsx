import { 
    FormControl, 
    FormErrorMessage, 
    FormLabel 
} from '@chakra-ui/form-control'
import {Field, useField} from 'formik'
import {Input} from "@chakra-ui/input"

const TextField = ({label, ...props}) => {
    const [field, meta] = useField(props)
  return (
    <FormControl isInvalid={meta.touched && meta.error}>
        <FormLabel>{label}</FormLabel>
        <Input as={Field} {...field} {...props}></Input>
        <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  )
}

export default TextField

