import { InputBase, Box, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getSearchedProducts } from '../../../redux/userHandle';

const Search = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = () => {
        dispatch(getSearchedProducts("searchProduct", searchTerm));

        // ERROR:: Conditional check for pathname is not necessary for navigation
        if (location.pathname === "/ProductSearch") {
            navigate("/ProductSearch");
        }
    };

    return (
        <SearchContainer>
            <InputSearchBase
                placeholder="Search for products, brands and more"
                value={searchTerm}
                // ERROR:: 'etargetvalue' is not defined; should be 'e.target.value'
                onChange={(e) => setSearchTerm(e.target.value)} // Corrected
                onKeyDown={(e) => {
                    // ERROR:: 'ekey' is not defined; should be 'e.key'
                    if (e.key === 'Enter') { // Corrected condition
                        handleSearch();
                    }
                }}
            />
            <SearchIconWrapper>
                <SearchIcon sx={{ color: "#4d1c9c" }} />
            </SearchIconWrapper>
        </SearchContainer>
    )
}

const SearchContainer = styled(Box)`
  border-radius: 2px;
  margin-left: 10px;
  width: 38%;
  background-color: #fff;
  display: flex;
`;

const SearchIconWrapper = styled(Box)`
  margin-left: auto;
  padding: 5px;
  display: flex;
  color: blue;
`;

const InputSearchBase = styled(InputBase)`
  font-size: unset;
  width: 100%;
  padding-left: 20px;
`;

export default Search;
