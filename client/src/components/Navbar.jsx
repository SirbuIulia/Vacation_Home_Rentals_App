import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { Search, Person, Menu, Translate } from "@mui/icons-material";
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExitToApp from '@mui/icons-material/ExitToApp';
import variables from "../styles/variables.scss";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";

const Navbar = () => {
    const [dropdownMenu, setDropdownMenu] = useState(false);
    const [showTranslate, setShowTranslate] = useState(false);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const translateEl = document.getElementById('google_translate_element');
        if (translateEl) {
            translateEl.style.display = showTranslate ? 'block' : 'none';
        }
    }, [showTranslate]);
    const handleTranslateClick = () => {
        setShowTranslate((prev) => !prev);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(setLogout());
        navigate('/login');
    };

    useEffect(() => {
    }, [user, navigate]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (search) {
            navigate(`/properties/search/${search}`);
        }
    };




    return (
        <div className="navbar">
            <a href="/">
                <img src="/assets/logo.png" alt="logo" />
            </a>

            <form className="navbar_search" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Caută ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && search) { e.preventDefault(); navigate(`/properties/search/${search}`); } }}
                />
                <IconButton type="submit" disabled={search === ""} onClick={() => { navigate(`/properties/search/${search}`) }}>
                    <Search sx={{ color: variables.pinkred }} />
                </IconButton>
            </form>

            <div className="navbar_right">
                <IconButton onClick={handleTranslateClick} sx={{ color: variables.pinkred, marginLeft: '20px' }}>
                    <Translate />
                </IconButton>

                <div id="google_translate_element" style={{ display: showTranslate ? 'block' : 'none' }}></div>

                {user ? (
                    <a href="/create-listing" className="host">
                        Publică-ți propritatea
                    </a>
                ) : (
                    <a href="/login" className="host">
                        Publică-ți propritatea
                    </a>
                )}

                <button
                    className="navbar_right_account"
                    onClick={() => setDropdownMenu(!dropdownMenu)}
                >
                    <Menu sx={{ color: variables.darkgrey }} />
                    {!user ? (
                        <Person sx={{ color: variables.darkgrey }} />
                    ) : (
                        <img
                            src={user.profileImagePath.startsWith('http') ? user.profileImagePath : `http://localhost:3001/${user?.profileImagePath?.replace("public", "")}`}
                            alt="Profile"
                            style={{ width: '50px', height: '50px', objectFit: "cover", borderRadius: "50%" }}
                        />
                    )}
                </button>

                {dropdownMenu && !user && (
                    <div className="navbar_right_accountmenu">
                        <Link to="/login">Autentificare</Link>
                        <Link to="/register">Înregistrare</Link>
                    </div>
                )}

                {dropdownMenu && user && (
                    <div className="navbar_right_accountmenu">
                        <Link to={`/${user._id}/trips`}>
                            <FlightTakeoffIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Listă călătorii
                        </Link>
                        <br />
                        <Link to={`/${user._id}/wishList`}>
                            <FavoriteIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Favorite
                        </Link>
                        <br />
                        <Link to={`/${user._id}/properties`}>
                            <HomeWorkIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Proprietăți
                        </Link>
                        <br />
                        <Link to={`/${user._id}/reservations`}>
                            <BookOnlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Proprietăți rezervate de clienți
                        </Link>
                        <br />
                        <Link to="/create-listing">
                            <AddCircleOutlineIcon sx={{ verticalAlign: 'middle', mr: 1 }} /> Publică-ți proprietatea
                        </Link>

                        <Link
                            onClick={handleLogout}
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >
                            <ExitToApp sx={{ verticalAlign: 'middle', mr: 1 }} /> Deconectare
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
