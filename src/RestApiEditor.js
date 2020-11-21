import React, {Component} from "react";
import Nav from "react-bootstrap/Nav";
import {Button, Col, ListGroup, Row, Toast} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import DropdownItem from "react-bootstrap/DropdownItem";
import NavDropdown from "react-bootstrap/NavDropdown";
import FormCheck from "react-bootstrap/FormCheck";
import axios from 'axios';
import qs from 'qs';
import Spinner from "react-bootstrap/Spinner";

export default class RestApiEditor extends Component {
    constructor(props) {
        super(props);
        let headers = [];
        headers[0] = {'key': '', 'value': ''};

        let params = [];
        params[0] = {'key': '', 'value': ''};

        let body = [];
        body[0] = {'key': '', 'value': ''};

        this.state = {
            headers: headers,
            params: params,
            body: body,
            currentTab: 'Params',
            methodSelected: 'GET',
            body_type: 'none',
            body_string: null,
            url_test: '',
            showToast: false,
            showLoading: false,
            message_toast: '',
            codeResult: '',
            httpMethod: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'COPY', 'HEAD', 'OPTION', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND', 'VIEW']
        }
    }


    // event for params
    handleParamURLsValueChange(e, index) {
        let params = this.state.params;
        params[index].value = e.target.value;
        this.setState({
            params: params
        })

        if (e.target.value != null && e.target.value !== '') {
            this.addParamURLs();
        }
    }

    handleParamURLsKeyChange(e, index) {
        let params = this.state.params;
        params[index].key = e.target.value;
        this.setState({
            params: params
        })
        if (e.target.value != null && e.target.value !== '') {
            this.addParamURLs();
        }
    }

    addParamURLs() {
        //check last item is empty or not before add a new item
        let params = this.state.params;
        let headerLength = params.length;
        if ((params[headerLength - 1].value !== '' || params[headerLength - 1].key !== '')) {
            params.push({'key': '', 'value': ''});
            this.setState({
                params: params
            })
        }
    }

    removeParamURLs(index) {
        console.log('remove index; ' + index);
        let params = this.state.params;
        let headerLength = params.length;
        if (headerLength > 1) {
            if (index !== headerLength - 1) {
                params.splice(index, 1);
                this.setState({
                    params: params
                })
            }
        } else {
            params[index].key = '';
            params[index].value = '';
            this.setState({
                params: params
            })
        }
    }

    // end event for params


    // event for header
    handleHeaderValueChange(e, index) {
        let headers = this.state.headers;
        headers[index].value = e.target.value;
        this.setState({
            headers: headers
        })

        if (e.target.value != null && e.target.value !== '') {
            this.addHeader();
        }
    }

    handleHeaderKeyChange(e, index) {
        let headers = this.state.headers;
        headers[index].key = e.target.value;
        this.setState({
            headers: headers
        })
        if (e.target.value != null && e.target.value !== '') {
            this.addHeader();
        }
    }

    addHeader() {
        //check last item is empty or not before add a new item
        let headers = this.state.headers;

        let headerLength = headers.length;
        if ((headers[headerLength - 1].value !== '' || headers[headerLength - 1].key !== '')) {
            headers.push({'key': '', 'value': ''});
            this.setState({
                headers: headers
            })
        }
    }

    removeHeaders(index) {
        let headers = this.state.headers;
        let headerLength = headers.length;
        if (headerLength > 1) {
            if (index !== headerLength - 1) {
                headers.splice(index, 1);
                this.setState({
                    headers: headers
                })
            }
        } else {
            headers[index].key = '';
            headers[index].value = '';
            this.setState({
                headers: headers
            })
        }
    }

    // end event for header


    // event for body
    handleBodyValueChange(e, index) {
        let body = this.state.body;
        body[index].value = e.target.value;
        this.setState({
            body: body
        })

        if (e.target.value != null && e.target.value !== '') {
            this.addBody();
        }
    }

    handleBodyKeyChange(e, index) {
        let body = this.state.body;
        body[index].key = e.target.value;
        this.setState({
            body: body
        })
        if (e.target.value != null && e.target.value !== '') {
            this.addBody();
        }
    }

    addBody() {
        //check last item is empty or not before add a new item
        let body = this.state.body;

        let headerLength = body.length;
        if ((body[headerLength - 1].value !== '' || body[headerLength - 1].key !== '')) {
            body.push({'key': '', 'value': ''});
            this.setState({
                body: body
            })
        }
    }

    removeBody(index) {
        let body = this.state.body;
        let headerLength = body.length;
        if (headerLength > 1) {
            if (index !== headerLength - 1) {
                body.splice(index, 1);
                this.setState({
                    body: body
                })
            }
        } else {
            body[index].key = '';
            body[index].value = '';
            this.setState({
                body: body
            })
        }
    }

    // end event for body

    selectTabType(tab) {
        console.log('selectTabType: ' + tab);
        this.setState({
            currentTab: tab
        })
    }

    handleURLInput(e) {
        this.setState({
            url_test: e.target.value
        });
    }

    selectedMethod(method) {
        this.setState({
            methodSelected: method
        })
    }

    bodyTypeChange(bodyType) {
        console.log('bodyType: ' + bodyType);
        this.setState({
            body_type: bodyType
        })
    }

    handleRawInput(e) {
        this.setState({
            body_string: e.target.value
        })
    }

    function

    isValidHttpUrl(string) {
        let url;

        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    sendApi() {
        this.setState({
            showLoading: true
        })
        let isValid = true;
        let message = '';
        if (this.state.url_test === null || this.state.url_test === '') {
            message = 'Please input request URL';
            isValid = false;
        } else {
            if (!this.isValidHttpUrl(this.state.url_test)) {
                message = 'URL is wrong format. Please input a request URL.';
                isValid = false;
            }
        }

        let paramLen = this.state.params.length;
        if (paramLen >= 2) {
            for (let index = 0; index < paramLen; index++) {
                if (index !== paramLen - 1 && (this.state.params[index].key === '')) {
                    isValid = false;
                    message = 'Please complete params for all key and value';
                }
            }
        }


        let headerLen = this.state.headers.length;
        if (headerLen >= 2) {
            for (let index = 0; index < headerLen; index++) {
                if (index !== headerLen - 1 && (this.state.headers[index].key === '' || this.state.headers[index].value === '')) {
                    isValid = false;
                    message = 'Please complete headers for all key and value';
                }
            }
        }

        if (this.state.body_type === 'form-data' || this.state.body_type === 'x-www-form-urlencoded') {
            let bodyLen = this.state.body.length;
            if (bodyLen >= 2) {
                for (let index = 0; index < bodyLen; index++) {
                    {
                        if (index !== bodyLen - 1 && (this.state.body[index].key === '')) {
                            isValid = false;
                            message = 'Please complete body parameters for all key and value';
                        }
                    }
                }
            }
        }

        if (!isValid) {
            this.setState({
                message_toast: message,
                showLoading: false
            })
            this.setShow(true);
            console.log("Data is In-Valid");
        } else {
            // send request api
            console.log("Data is Valid");

            let headers = {
                'Content-Type': 'application/json;charset=utf-8',
                // 'Access-Control-Allow-Origin': '*/*',
                // 'User-Agent': 'PostmanRuntime/7.26.5',
                'Accept': '*/*',
                // 'User-Agent': 'Jsondev-RequestAPI',
                // 'Cache-Control': null,
                // 'X-Requested-With': null,
                // 'Accept-Encoding': 'gzip, deflate, br',
                // 'Connection': 'keep-alive',
                // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
                // 'Access-Control-Allow-Headers': '*',
            }


            for (let index = 0; index < this.state.headers.length - 1; index++) {
                let key_name = this.state.headers[index].key;
                let value = this.state.headers[index].value;
                headers[key_name] = value;
            }

            let params = {};
            for (let index = 0; index < this.state.params.length - 1; index++) {
                let key_name = this.state.params[index].key;
                let value = this.state.params[index].value;
                params[key_name] = value;
            }

            let data = null;
            if (this.state.body_type === 'form-data') {
                let body = {};
                for (let index = 0; index < this.state.body.length - 1; index++) {
                    let key_name = this.state.body[index].key;
                    let value = this.state.body[index].value;
                    body[key_name] = value;
                }
                data = body;
            } else if (this.state.body_type === 'x-www-form-urlencoded') {
                headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                let body = {};
                for (let index = 0; index < this.state.body.length - 1; index++) {
                    let key_name = this.state.body[index].key;
                    let value = this.state.body[index].value;
                    body[key_name] = value;
                }
                data = qs.stringify(body);
            } else if (this.state.body_type === 'raw') {
                data = this.state.body_string
            }
            console.log('headers: ');
            console.log(headers);
            console.log('params: ');
            console.log(params);
            console.log('body: ');
            console.log(data);

            let config = {
                method: this.state.methodSelected,
                url: this.state.url_test,
                headers: headers,
                params: params,
                data: data
            };

            let component = this;
            axios(config)
                .then(function (response) {
                    console.log('Send REST Api result: ');
                    let dataResponse = response.data;
                    if (dataResponse != null) {
                        //send data to application
                        let jsonCallBack = {
                            data: dataResponse,
                            status: 1
                        }


                        component.setState({
                            showLoading: false,
                            codeResult: JSON.stringify(dataResponse),
                            message_toast: 'Sent Rest API has successfully. Please check Json Result on Right side.'
                        })
                        component.setShow(true);

                    }
                })
                .catch(function (error) {
                    console.log('error request api');
                    // let errorJson = error.toJSON();
                    // console.log(errorJson);
                    console.log('NetworkStatus: ' + error.toString());

                    console.log(error.response);
                    // let jsonCallBack = {
                    //     data: error.toString(),
                    //     status: 0
                    // }
                    // component.props.parentCallback(jsonCallBack);
                    let statusText ='';
                    try {
                        statusText = error.response.statusText;
                    }catch (e) {

                    }
                    component.setState({
                        showLoading: false,
                        codeResult: error.toString() + ".\n" + statusText,
                        message_toast: error.toString() + ".\n" + statusText
                    })
                    component.setShow(true);
                });
        }
    }

    setShow(showToast) {
        this.setState({
            showToast: showToast
        })
    }

    render() {

        return (
            <div>
                <Row className={'m-0 p-0 mt-2'}>
                    <Col sm={1.5} className={'m-0 p-0 align-self-center'}>
                        <NavDropdown className={'m-0 p-0'}
                                     onSelect={(method, syntheticEvent) => this.selectedMethod(method)}
                                     title={this.state.methodSelected}>
                            {
                                this.state.httpMethod.map((item, index) => (
                                    <DropdownItem className={'m-0 p-0'} eventKey={item}>{item}</DropdownItem>
                                ))
                            }
                        </NavDropdown>
                    </Col>
                    <Col className={'align-self-center'}>
                        <input className={'m-0 pl-2 pr-2 pt-1 pb-1'} placeholder={'Enter request URL'} type={'text'}
                               value={this.state.url_test}
                               style={{width: '100%'}}
                               onClick={(e) => e.target.select()}
                               onChange={(e) => this.handleURLInput(e)}/>
                    </Col>
                    <Col className={'ml-1 mr-1 align-self-center'} xs={1.5}>
                        <Button className={'m-0 p-0 pr-2 pl-2 pt-1 pb-1'} style={{float: 'right'}}
                                onClick={() => this.sendApi()}
                                variant="outline-success">
                            {this.state.showLoading &&
                            < Spinner
                                className={'mr-2'}
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                />}
                            Send
                        </Button>
                    </Col>
                </Row>
                <Row className={'mt-1 mb-1'}>
                    <Col>
                        <Nav className={'m-0 p-0'} variant="tabs" defaultActiveKey={'Params'}>
                            <Nav.Item className={'m-0 p-0'}>
                                <Nav.Link className={'m-0 pt-1 pb-0 pl-2 pr-2'} eventKey={'Params'}
                                          onSelect={(tab, syntheticEvent) => this.selectTabType(tab)}>Params</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className={'m-0 p-0'}>
                                <Nav.Link className={'m-0 pt-1 pb-0 pl-2 pr-2'} eventKey={'Headers'}
                                          onSelect={(tab, syntheticEvent) => this.selectTabType(tab)}>Headers</Nav.Link>
                            </Nav.Item>
                            <Nav.Item className={'m-0 p-0'}>
                                <Nav.Link className={'m-0 pt-1 pb-0 pl-2 pr-2'} eventKey={'Body'}
                                          onSelect={(tab, syntheticEvent) => this.selectTabType(tab)}>Body</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Row>

                {/*input params area*/}
                <ul className={'mt-2 m-0 p-0'}>
                    {this.state.currentTab === 'Params' && this.state.params.map((item, index) => (
                        <Row className={'m-0 p-0 mt-2'}>
                            <Col className={'m-0 p-0'}>
                                <input className={'pl-2 pr-2'} placeholder={'Key'} type={'text'}
                                       onClick={(e) => e.target.select()}
                                       value={this.state.params[index].key}
                                       style={{width: '100%'}}
                                       onChange={(e) => this.handleParamURLsKeyChange(e, index)}/>
                            </Col>
                            <Col className={'m-0 p-0 ml-2'}>
                                <input className={'pl-2 pr-2'} placeholder={'Value'} type={'text'}
                                       style={{width: '100%'}}
                                       onClick={(e) => e.target.select()}
                                       value={this.state.params[index].value}
                                       onChange={(e) => this.handleParamURLsValueChange(e, index)}/>
                            </Col>
                            <Col xs={1} className={'m-0 p-0'}>
                                <Button variant="light" className={'m-0 ml-2 p-0 pl-1 pr-1'}
                                        onClick={() => this.removeParamURLs(index)}><FontAwesomeIcon
                                    icon={faTrash}/></Button>
                            </Col>

                        </Row>

                    ))}

                    {this.state.currentTab === 'Headers' && this.state.headers.map((item, index) => (
                        <Row className={'m-0 p-0 mt-2'}>
                            <Col className={'m-0 p-0'}>
                                <input className={'pl-2 pr-2'} placeholder={'Key'} type={'text'}
                                       value={this.state.headers[index].key}
                                       style={{width: '100%'}}
                                       onClick={(e) => e.target.select()}
                                       onChange={(e) => this.handleHeaderKeyChange(e, index)}/>
                            </Col>
                            <Col className={'m-0 p-0 ml-2'}>
                                <input className={'pl-2 pr-2'} placeholder={'Value'} type={'text'}
                                       style={{width: '100%'}}
                                       onClick={(e) => e.target.select()}
                                       value={this.state.headers[index].value}
                                       onChange={(e) => this.handleHeaderValueChange(e, index)}/>
                            </Col>
                            <Col xs={1} className={'m-0 p-0'}>
                                <Button variant="light" className={'m-0 ml-2 p-0  pl-1 pr-1'}
                                        onClick={() => this.removeHeaders(index)}><FontAwesomeIcon
                                    icon={faTrash}/></Button>
                            </Col>
                        </Row>
                    ))}

                    {this.state.currentTab === 'Body' &&
                    (
                        <Row>

                            <Col>
                                <Row>
                                    <Col>
                                        <ListGroup horizontal={true}>
                                            <FormCheck accessKey={'none'}
                                                       onChange={() => this.bodyTypeChange('none')}
                                                       defaultChecked={true} name={'body_type'} type={"radio"}
                                                       label={'none'}/>

                                            <FormCheck accessKey={'form-data'}
                                                       onChange={() => this.bodyTypeChange('form-data')}
                                                       className={'ml-2'} name={'body_type'} type={"radio"}
                                                       label={'form-data'}/>

                                            <FormCheck accessKey={'x-www-form-urlencoded'}
                                                       onChange={() => this.bodyTypeChange('x-www-form-urlencoded')}
                                                       className={'ml-2'} name={'body_type'} type={"radio"}
                                                       label={'x-www-form-urlencoded'}/>

                                            <FormCheck accessKey={'raw'} className={'ml-2'}
                                                       onChange={() => this.bodyTypeChange('raw')}
                                                       name={'body_type'}
                                                       type={"radio"}
                                                       label={'raw'}/>
                                        </ListGroup>
                                    </Col>
                                </Row>
                                {(this.state.body_type === 'form-data' || this.state.body_type === 'x-www-form-urlencoded') && this.state.body.map((item, index) => (
                                    <Row className={'m-0 p-0 mt-2'}>
                                        <Col className={'m-0 p-0'}>
                                            <input className={'pl-2 pr-2'} placeholder={'Key'} type={'text'}
                                                   value={this.state.body[index].key}
                                                   style={{width: '100%'}}
                                                   onClick={(e) => e.target.select()}
                                                   onChange={(e) => this.handleBodyKeyChange(e, index)}/>
                                        </Col>
                                        <Col className={'m-0 p-0 ml-2'}>
                                            <input className={'pl-2 pr-2'} placeholder={'Value'} type={'text'}
                                                   style={{width: '100%'}}
                                                   onClick={(e) => e.target.select()}
                                                   value={this.state.body[index].value}
                                                   onChange={(e) => this.handleBodyValueChange(e, index)}/>
                                        </Col>
                                        <Col xs={1} className={'m-0 p-0'}>
                                            <Button variant="light" className={'m-0 ml-2 p-0  pl-1 pr-1'}
                                                    onClick={() => this.removeBody(index)}><FontAwesomeIcon
                                                icon={faTrash}/>
                                            </Button>
                                        </Col>
                                    </Row>
                                ))}

                                {this.state.body_type === 'raw' &&
                                <Row>
                                    <Col sm={12}>
                                        <textarea className={'p-2 raw_box'} value={this.state.body_string}
                                                  onChange={(e) => this.handleRawInput(e)}/>
                                    </Col>
                                </Row>
                                }
                            </Col>
                        </Row>
                    )
                    }
                </ul>

                {/*<Row className={'mt-4'}>*/}
                {/*    <Col xs={6}>*/}
                {/*        <Toast onClose={() => this.setShow(false)} show={this.state.showToast} delay={3000}*/}
                {/*               autohide>*/}
                {/*            <Toast.Header>*/}
                {/*                <img*/}
                {/*                    className="rounded mr-2"*/}
                {/*                    alt=""*/}
                {/*                />*/}
                {/*                <strong className="mr-auto">Alert message!</strong>*/}
                {/*            </Toast.Header>*/}
                {/*            <Toast.Body>{this.state.message_toast}</Toast.Body>*/}
                {/*        </Toast>*/}
                {/*    </Col>*/}
                {/*</Row>*/}

                <Row>
                    <Col xl={12}>
                        <p>Result</p>
                        <textarea className={'p-2'} style={{width:'100%', minHeight:'200px'}} placeholder={'Rest Api result is displayed in here...'} value={this.state.codeResult}/>
                    </Col>
                </Row>
            </div>
        );
    }
}