import React from 'react'

const Hovno = ({children}) => {
const [hovno, setHovno] = React.useState(true)
const allHovno = React.Children.map(children, (child) => {
    const klon = React.cloneElement(child, {
        hovno,
        setHovno
    })
    return klon
})
return allHovno
}

const Hovno2 = ({ children}) => {
    return (
    <div>
        {
        React.Children.map(children, (child) => {
            if(child.type !== 'function')
            {
                return <p className="template">{child}</p>
            } 
            })
        }
    </div>

    )
}


const Temp2 = ({ children }) => {

    return (
        <div>
            <Hovno>
                <Hovno2>
                    {children}
                </Hovno2>
            </Hovno>
        </div>
        
    )       
}



export default Temp2