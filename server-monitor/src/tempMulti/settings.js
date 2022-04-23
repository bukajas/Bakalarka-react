import React from "react";
import { Drawer, Button, Space, Radio, message, Form, Input, Checkbox } from 'antd';
import { CheckboxInt } from '../components/App'
import { DownloadOutlined } from '@ant-design/icons';


const Settings = () => {


  const context = React.useContext(CheckboxInt)
  const { dates, setDates } = context

  const onFinish = (values) => {
    console.log('Success:', values);
    setDates([...dates, {name: values.name,ip: values.ip, os: values.os, status: false } ])
    message.success('Server successfully added');
  }
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Error with adding server');
  }
  
  function removeServer(e){
      const x = e.target.getAttribute("removeips")
      console.log(e)
      console.log(x)
      setDates(dates.filter((items) => items.ip !== x))

  }
  
  return (
    <>
    <Form name="basic" labelCol={{ span: 8,}} wrapperCol={{  span: 16,}} onFinish={onFinish} onFinishFailed={onFinishFailed} autoComplete="off">
      <Form.Item label="Device Name" name="name"        
      rules={[
          {
            required: true,
            message: 'Device Name of server required!',
          },
        ]}
        >
        <Input />
      </Form.Item>

      <Form.Item
        label="IP address"
        name="ip"
        rules={[
          {
            required: true,
            message: 'IP address is required',
          },
        ]}
        >
        <Input />
      </Form.Item>

      <Form.Item
        label="OS"
        name="os"
        rules={[
          {
            required: true,
            message: 'OS is required',
          },
        ]}
        >
        <Input />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
        >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>

    {
    dates.map((dates) => <p>{dates.ip} <Button danger><p removeips={dates.ip} onClick={removeServer}>Remove Server</p> </Button></p>)
    }


    </>
  );
};



export default Settings;