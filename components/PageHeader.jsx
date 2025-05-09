/* eslint-disable react/prop-types */
import React from 'react';
import Link from 'next/link';

const PageHeader = ({ title, curPage }) => (
  <div className="pageheader-section" style={{marginTop: 0}}>
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="pageheader-content text-center">
            <h2>{title}</h2>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb justify-content-center">
                <li className="breadcrumb-item">
                  <Link href="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {curPage}
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PageHeader;
