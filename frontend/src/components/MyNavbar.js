// src/components/MyNavbar.js
import React, { useState } from 'react';
import { Navbar, Offcanvas, Nav, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Link をインポート
import ProfileAvatar from './ProfileAvatar';
import styles from './MyNavbar.module.css'; // 新しいCSSモジュールをインポート

const MyNavbar = ({ onLogout }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar expand={false} fixed="top" className={styles.navbarContainer}>
        <Container fluid className="d-flex justify-content-between align-items-center">
          <Button onClick={handleShow} className={styles.toggleButton}>
            <i className="bi bi-list"></i> {/* ハンバーガーメニューアイコン */}
          </Button>
          <div className="d-flex align-items-center">
            <ProfileAvatar onLogout={onLogout} />
          </div>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} placement="start" className={styles.offcanvasMenu}>
        <Offcanvas.Header closeButton className={styles.offcanvasHeader}>
          <Offcanvas.Title className={styles.offcanvasTitle}>メニュー</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" className={styles.navLink} onClick={handleClose}>ホーム</Nav.Link>
            <Nav.Link as={Link} to="/diary" className={styles.navLink} onClick={handleClose}>予定と記録</Nav.Link>
            <Nav.Link as={Link} to="/timetable" className={styles.navLink} onClick={handleClose}>時間割</Nav.Link>
            <Nav.Link as={Link} to="/sleep-master" className={styles.navLink} onClick={handleClose}>おやすみマスター</Nav.Link>
            <Nav.Link as={Link} to="/tategram" className={styles.navLink} onClick={handleClose}>tategram</Nav.Link>
            <Nav.Link as={Link} to="/settings" className={styles.navLink} onClick={handleClose}>設定</Nav.Link>
            <Nav.Link as={Link} to="/profile" className={styles.navLink} onClick={handleClose}>プロフィール</Nav.Link>
            <Nav.Link className={styles.logoutButton} onClick={() => { handleClose(); onLogout(); }}>ログアウト</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default MyNavbar;
