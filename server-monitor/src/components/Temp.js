import React from 'react'
import Temp2 from './Temp2'
import Temp3 from './Temp3'
import Temp4 from './Temp4'

const Checkbox = ({children}) => {
    const [checked, setChecked] = React.useState(true)

    const allChildren = React.Children.map(children, (child) => {
        const clone = React.cloneElement(child, {
            checked,
            setChecked
        })
        return clone
    })
    return allChildren
}

const CheckboxInput = ({checked, setChecked}) => {

    return (<input type="checkbox" checked={checked} onChange={(e) => {setChecked(e.target.checked)}}/> )       
}

const Label = ({ setChecked, children}) => {
    return <label onClick={() => {setChecked(state => !state)}}>{children}</label>
}




const Temp = () => {
  return (
    <div>

        <div>
        <Temp3>
            <p>Temp3</p>
            <p>YES THIS IS 2</p>
            <p>YES THIS IS 3</p>
        </Temp3>
        
        
        </div>
        </div>
  )
}

export default Temp
