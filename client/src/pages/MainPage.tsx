import toast, {Toaster} from "react-hot-toast";
import {Button, Container, FormCheck, Form, Pagination, Table, InputGroup, Spinner, Row, Col} from "react-bootstrap";
import NavBar from "../components/NavBar.tsx";
import {useEffect, useState} from "react";
import {activateUsers, auth, blockUsers, deleteUsers, getUsers} from "../http/userAPI.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLock, faLockOpen, faRefresh, faSearch, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useUserStore} from "../store.ts";
import {useNavigate} from "react-router";

type UserData = {
    _id: string;
    email: string;
    name: string;
    status: string;
    lastLoginTime: string;
    registrationTime: string;
}

type UsersResponse = {
    totalPages: number;
    currentPage: number;
    totalCount: number;
    users: UserData[];
}

function MainPage() {
    const isAuth = useUserStore((store) => store.isAuth)
    const setUser = useUserStore((store) => store.setUser )
    const logOut = useUserStore((store) => store.logOut )
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [search, setSearch] = useState('')
    const [limit, setLimit] = useState(10)
    const [data, setData] = useState<UsersResponse>({
        users: [],
        totalPages: 0,
        currentPage: 1,
        totalCount: 0
    })
    const [selected, setSelected] = useState<string[]>([])

    function loadUsers(page: number) {
        setIsLoading(true)
        setIsError(false)
        getUsers({page: page, limit: limit, search: search})
            .then(res => {
                setData({
                    users: res.users,
                    totalPages: res.totalPages,
                    currentPage: res.currentPage,
                    totalCount: res.totalCount
                })
                setIsLoading(false)
                setIsError(false)
            })
            .catch(e => {
                setIsLoading(false)
                setIsError(true)
                toast.error(e.response.data.message)

                if(localStorage.getItem("token") !== null){
                    auth()
                        .then(res => {
                            setUser(res.email)
                        })
                        .catch(()=> {
                            logOut()
                        })
                }

            })
    }

    useEffect(() => {
        loadUsers(1)
    }, [limit]);

    useEffect(() => {
        if(!isAuth) navigate('/login')
    }, [isAuth])



    function formatDateTime(isoDateTime: string) {
        const date = new Date(isoDateTime);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const
            day = date.getDate();
        const month = new Intl.DateTimeFormat('en-US', {month: 'short'}).format(date);
        const year = date.getFullYear();
        return `${hours}:${minutes}:${seconds}, ${day} ${month}, ${year}`;

    }

    const dataRow = (data: UserData) => {
        function changeSelection(e) {
            if (e.target.checked) {
                setSelected(prevState => ([
                    ...prevState,
                    data.email
                ]))
            } else {
                setSelected(prevState => (prevState.filter(i => i !== data.email)))
            }
        }

        return <tr key={data._id}>
            <td className={'text-center'}>
                <FormCheck
                    onChange={changeSelection}
                    checked={selected.includes(data.email)}
                />
            </td>
            <td>{data.name}</td>
            <td>{data.email}</td>
            <td>{formatDateTime(data.lastLoginTime)}</td>
            <td>{formatDateTime(data.registrationTime)}</td>
            <td>{data.status}</td>
        </tr>

    }

    function renderContent() {
        if (isLoading) {
            return (
                <div className={'d-flex justify-content-center align-items-center py-5'}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>

            )
        }
        if (isError) {
            return (
                <div className={'d-flex flex-column gap-2 justify-content-center align-items-center py-5'}>
                    <Form.Text style={{fontSize: 20}}>
                        Error occurred!
                    </Form.Text>
                    <div className={'d-flex align-items-center gap-3'}>
                        <Form.Text style={{fontSize: 20}}>
                            Try again
                        </Form.Text>
                        <Button
                            variant='outline-primary'
                            onClick={() => {
                                loadUsers(1)
                            }}
                        >
                            <FontAwesomeIcon icon={faRefresh}/>
                        </Button>
                    </div>

                </div>
            )
        }

        return (
            <Table className={''} responsive striped bordered hover>
                <thead>
                <tr>
                    <th className={'text-center'}>
                        <FormCheck
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelected([
                                        ...data.users.map(i => i.email)
                                    ])
                                } else {
                                    setSelected([])
                                }
                            }}/>
                    </th>
                    <th>Name</th>
                    <th>E-Mail</th>
                    <th>Last login time</th>
                    <th>Registration time</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {
                    data.users.map(user => dataRow(user))
                }
                </tbody>
            </Table>
        )
    }


    return (
        <>
            <NavBar/>
            <Container>
                <Row xs={1} md={2} className={'gap-3 py-3 justify-content-between'}>
                    <Col md={6} className={'d-flex gap-3'}>
                        <Button
                            variant={'outline-dark'}
                            onClick={() => {
                                if (selected.length === 0) return
                                blockUsers(selected)
                                    .then(res => {
                                        toast.success(res.data.message)
                                        loadUsers(data.currentPage)
                                    })
                                    .catch(e => {
                                        toast.error(e.response.data.message)
                                    })
                            }}>
                            <FontAwesomeIcon icon={faLock}/> Block
                        </Button>
                        <Button
                            variant={'outline-dark'}
                            onClick={() => {
                                if (selected.length === 0) return
                                activateUsers(selected)
                                    .then(res => {
                                        toast.success(res.data.message)
                                        loadUsers(data.currentPage)
                                    })
                                    .catch(e => {
                                        toast.error(e.response.data.message)
                                    })
                            }}>
                            <FontAwesomeIcon icon={faLockOpen}/>
                        </Button>
                        <Button
                            variant={'outline-dark'}
                            onClick={() => {
                                if (selected.length === 0) return
                                deleteUsers(selected)
                                    .then(res => {
                                        toast.success(res.data.message)
                                        loadUsers(data.currentPage)
                                    })
                                    .catch(e => {
                                        toast.error(e.response.data.message)
                                    })
                            }}>
                            <FontAwesomeIcon icon={faTrash}/>
                        </Button>
                    </Col>

                    <Col md={5} className={'d-flex align-items-center justify-content-center gap-3'}>
                        <InputGroup>
                            <Form.Control
                                value={search}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setSearch(value.trim())
                                }}
                                onKeyDown={(event) => {
                                    if (event.code === 'Enter') {
                                        loadUsers(1)
                                    }
                                }}
                            />
                            <Button variant={'primary'} onClick={() => {
                                loadUsers(1)
                            }}>
                                <FontAwesomeIcon icon={faSearch}/>
                            </Button>
                        </InputGroup>

                        <Form.Select value={limit} className={'w-auto'}
                                     onChange={(e) => {
                                         setLimit(Number(e.target.value))
                                     }}
                        >
                            {
                                data.totalCount > 10 &&
                                <option value="10">10</option>
                            }
                            {
                            data.totalCount > 30 &&
                                <option value="30">30</option>
                            }
                            <option value={data.totalCount}>{data.totalCount}</option>
                        </Form.Select>
                    </Col>


                </Row>
                {renderContent()}
                <div className={'d-flex align-items-center justify-content-center'}>
                    <Pagination className={'mt-3'}>
                        <Pagination.Prev
                            onClick={() => {
                                if (data.currentPage - 1 <= 1) loadUsers(1)
                                else loadUsers(data.currentPage - 1)
                            }}

                        />
                        <Pagination.Item
                            active={1 === data.currentPage}
                            onClick={() => {
                                loadUsers(1)
                            }}
                        >{1}</Pagination.Item>

                        {
                            data.totalPages > 7 &&
                            <Pagination.Ellipsis/>
                        }

                        {
                            Array.from({length: data.totalPages - 2}, (_, index) => index + 2)
                                .slice(
                                    data.currentPage - 2 - 2 >= 0 ? (data.currentPage - 2 - 2) : 0,
                                    data.currentPage - 2 - 2 >= 0 ?
                                        (data.currentPage - 2 + 3)
                                        :
                                        (data.currentPage - 2 + 3 + Math.abs(data.currentPage - 2 - 2))
                                )
                                .map(i =>
                                    <Pagination.Item
                                        key={i}
                                        active={i === data.currentPage}
                                        onClick={() => {
                                            loadUsers(i)
                                        }}
                                    >{i}</Pagination.Item>
                                )

                        }

                        {
                            data.totalPages > 8 &&
                            <Pagination.Ellipsis/>
                        }
                        {
                            data.totalPages > 1 &&
                            <Pagination.Item
                                active={data.totalPages === data.currentPage}
                                onClick={() => {
                                    loadUsers(data.totalPages)
                                }}
                            >{data.totalPages}</Pagination.Item>
                        }
                        <Pagination.Next
                            onClick={() => {
                                if (data.currentPage + 1 >= data.totalPages) loadUsers(data.totalPages)
                                else loadUsers(data.currentPage + 1)
                            }}
                        />
                    </Pagination>
                </div>
            </Container>
            <Toaster/>
        </>
    );
}

export default MainPage;
