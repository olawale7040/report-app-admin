import PropTypes from 'prop-types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Navigation from './Navigation';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';

import useWindowSize from '../../hooks/useWindowSize';
import useOutsideClick from '../../hooks/useOutsideClick';
import { ConfigContext } from '../../contexts/ConfigContext';
import * as actionType from '../../store/actions';
import { authAdmin } from '../../api';
import { updateUser } from '../../slices/userSlice';
import { useDispatch } from '../../store';

const AdminLayout = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const dispatchStore = useDispatch();
  const windowSize = useWindowSize();
  const ref = useRef();
  const configContext = useContext(ConfigContext);

  const { collapseMenu, headerFixedLayout } = configContext.state;
  const { dispatch } = configContext;

  useEffect(() => {
    if (windowSize.width > 992 && windowSize.width <= 1024) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }

    if (windowSize.width < 992) {
      dispatch({ type: actionType.CHANGE_LAYOUT, layout: 'vertical' });
    }
  }, [dispatch, windowSize]);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const value = localStorage.getItem('amoAdmin');
      const loginUser = JSON.parse(value);
      if (value !== null) {
        authAdmin({ user_id: loginUser.id })
          .then((response) => {
            if (response.data.status === 200) {
              dispatchStore(updateUser(response.data.data));
            } else {
              window.location.href = '/login';
            }
          })
          .catch((error) => {
            console.error(error);
            window.location.href = '/login';
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        window.location.href = '/login';
      }
    };
    fetchUser();
  }, [dispatchStore]);

  useOutsideClick(ref, () => {
    if (collapseMenu) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
  });

  const mobileOutClickHandler = () => {
    if (windowSize.width < 992 && collapseMenu) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
  };

  let mainClass = ['pcoded-wrapper'];

  let common = (
    <React.Fragment>
      <Navigation />
      <NavBar />
    </React.Fragment>
  );

  let mainContainer = (
    <React.Fragment>
      <div className="pcoded-main-container">
        <div className={mainClass.join(' ')}>
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <Breadcrumb />
              {children}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );

  if (windowSize.width < 992) {
    let outSideClass = ['nav-outside'];
    if (collapseMenu) {
      outSideClass = [...outSideClass, 'mob-backdrop'];
    }
    if (headerFixedLayout) {
      outSideClass = [...outSideClass, 'mob-fixed'];
    }

    common = (
      <div className={outSideClass.join(' ')} ref={ref}>
        {common}
      </div>
    );

    mainContainer = (
      <div
        role="button"
        tabIndex="0"
        className="pcoded-outside"
        onClick={() => mobileOutClickHandler}
        onKeyDown={() => mobileOutClickHandler}
      >
        {mainContainer}
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <React.Fragment>
      {common}
      {mainContainer}
    </React.Fragment>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node
};
export default AdminLayout;
