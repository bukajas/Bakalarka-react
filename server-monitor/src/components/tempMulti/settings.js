import React from "react"
import { Dropdown, Card, Button, message, Form, Input } from 'antd'
import { CheckboxInt } from '../App'
import {
  QuestionCircleOutlined
} from '@ant-design/icons'




const Settings = () => {
  const context = React.useContext(CheckboxInt)
  const { dates, setDates, clickedServers, setClickedServers } = context

  const onFinish = (values) => {
    setDates([...dates, {name: values.name,ip: values.ip, description: values.description, status: 'CRITICAL' } ])
    message.success('Server successfully added');
  }
  
  const onFinishFailed = (errorInfo) => {
    message.error('Error adding server');
  }
  
  function removeServer(e){
      const x = e.target.getAttribute("removeips")
      setDates(dates.filter((items) => items.ip !== x))
      var filterClicked = clickedServers.filter((value) => {
        var tempString = value.split(" ")[0]
        return tempString !== x
        })
      setClickedServers(filterClicked)
  }

  return (
    <div>
    <div className="settings-form-whole">
    <Form name="basic" labelCol={{ span: 8,}} wrapperCol={{  span: 16,}} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
      <Form.Item label="Device Name" name="name"        
      rules={[{
            required: true,
            message: 'Device Name of server required!',
          },]} >
        <Input />
      </Form.Item>

      <Form.Item
        label="IP address"
        name="ip"
        rules={[{
            required: true,
            message: 'IP address is required',
          },]} >
        <Input />
      </Form.Item>

      <Form.Item

        label="Description"
        name="description"
        >
        <Input/>
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
        >
        <Button variant="contained" type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
    </div>
<div className="settings-remove-whole">
  <hr></hr>
    {dates.map((dates) => <div key={dates.ip} className="settings-remove-item">

      <div className='dashboard-card-ip'>{dates.ip} 
      <Dropdown overlay={       
        <Card size="small">
            <div>{dates.description}</div>
        </Card>}>
        <QuestionCircleOutlined/>
      </Dropdown> {" "}

      <Button type="primary" danger><div removeips={dates.ip} onClick={removeServer}>Remove</div> </Button></div>
      <div 

      className='dashboard-card-name'> {dates.name} 
      </div>
      <hr style={{width: '230px', marginLeft:'0' }}></hr>
      </div>)}
</div>
    </div>
  )}



export default Settings;