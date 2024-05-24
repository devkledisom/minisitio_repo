import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'bootstrap';

function MeuComponente() {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Meu App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Ação 1</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Ação 2</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Ação 3</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MeuComponente;
