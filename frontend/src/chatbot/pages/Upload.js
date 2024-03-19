import React, {useState} from "react";
import {Layout, Upload, Button, notification, Form, Input, Row, Col} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import axios from "axios";

import NavigationBar from "../../common/components/NavBar";

const {Content, Footer} = Layout;
const {Dragger} = Upload;

const UploadPage = () => {
    const [fileList, setFileList] = useState([]);
    const [form] = Form.useForm();
    const {firstname, lastname} = require("../../common/utils/auth").useAuth();

    const handleOk = async (values) => {
      try {
        const patientFirstname = form.getFieldValue().patientFirstname;
        const patientLastname = form.getFieldValue().patientLastname;

        if (fileList.length === 0) {
          notification.error({message: "Please select at least one file to upload"});
          return;
        }

        const formData = new FormData();
        formData.append("patient_firstname", patientFirstname);
        formData.append("patient_lastname", patientLastname);
        formData.append("doctor_firstname", firstname);
        formData.append("doctor_lastname", lastname);

        fileList.forEach((file) => {
          formData.append("fileList", file.originFileObj);
        });

        // await form.validateFields((err, val) => {
        //   const {filename, filetype, describe} = val;
        //   formData.append('filename', filename);
        //   formData.append('filetype', filetype);
        //   formData.append('dir', "../uploads");
        //   formData.append('describe', (describe === undefined ? "" : describe));
        // });

        axios
          .post("http://localhost:5001/api/files/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res);
            notification.success({message: res.data.message});
            form.resetFields();
            setFileList([]);
          })
          .catch((err) => {
            console.log(err);
            notification.error({
              message: err?.response?.data?.error || "Upload Failed",
            });
          });
      } catch (error) {
        notification.error({message: "Submit Error"});
        console.error(error);
      }
    };

    const props = {
      multiple: true,
      valuePropName: "fileList",
      showUploadList: {
        showRemoveIcon: true,
      },
      onChange: info => {
        const {status} = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          notification.success({message: `${info.file.name} uploaded successfully`});
        } else if (status === 'error') {
          notification.error({message: `${info.file.name} uploaded failed`});
        }
        setFileList((info.fileList));
        console.log(fileList);
      },
      onDrop: e => {
        console.log('Dropped files', e.dataTransfer.files);
      },
      onRemove: file => {
        const index = fileList.indexOf(file);
        const newFileList = [...fileList];
        newFileList.splice(index, 1);
        setFileList(newFileList);
      },
      beforeUpload: file => {
        console.log(file);
        let {name} = file;
        const fileExtension = name.substring(name.lastIndexOf('.') + 1);
        // this.props.form.setFieldsValue({
        //   "filename": name,
        //   "filetype": fileExtension,
        // });
        form.setFieldsValue({
          "filename": name,
          "filetype": fileExtension,
        });
        setFileList((prevFileList) => [...prevFileList, file]);
        return false;
      },
      fileList,
    };

    return (
      <Layout className="layout" style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <NavigationBar />
        <Content style={{ maxWidth: "600px", width: "100%" }}>
          <div className="upload-window" style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "80px"}}>
            <Form form={form} layout="vertical">
              <Form.Item
                name="patientFirstname"
                label="First Name"
                rules={[{ required: true, message: "Please enter the patient's first name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="patientLastname"
                label="Last Name"
                rules={[{ required: true, message: "Please enter the patient's last name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="fileList"
                label="Diagnosis Files"
                rules={[{ required: true, message: "Please select at least one file" }]}
              >
                <Dragger {...props} style={{ maxWidth: "500px" }}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for single or bulk upload Before uploading, please check the diagnosis is for this patient's
                  </p>
                </Dragger>
              </Form.Item>
            </Form>
          </div>
        </Content>
        <Footer style={{ textAlign: "center", paddingBottom: "100px" }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "200px" }}
            disabled={!form.isFieldsTouched(true) || fileList.length === 0}
            onClick={handleOk}
          >
            Upload
          </Button>
        </Footer>
      </Layout>
    );
  }
;

export default UploadPage;
