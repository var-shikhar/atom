import React from 'react';
import './navstyle.css';

const NavSteps = ({list, activeNav}) => {
  return (
    <div className='d-flex gap-2 justify-content-center mb-4 w-100 overflow-x-scroll'>
        {list?.map((nav, index) => (
            <div
                className='d-flex gap-2 align-items-center me-2'
                key={nav.id}>
                <div
                    className={`p-2 rounded-1 d-flex flex-column align-items-center justify-content-center text-white',
                        ${activeNav === nav.slug ? 'bg-success' : activeNav === nav.title ? 'px-3 bg-primary' : 'px-3 bg-white text-muted border'}`}>
                    {nav.completed ?  <div>Step-{index + 1}</div>  : <small className='min-content'>{nav.name}</small>}
                </div>
                <span
                    className={`min-content ${nav.completed ? 'fw-bold text-success' : activeNav === nav.title ? 'fw-bold text-primary' : 'text-muted opacity-50'}`}>
                    {nav.title}
                </span>
                {index + 1 < list?.length && (
                    <span
                        className={`border nav-separator ${nav.completed ? 'border-success' : activeNav === nav.title ? 'border-primary' : 'border-dark opacity-50'} ${!nav.completed && 'border-dotted'}`}
                    />
                )}
            </div>
        ))}
    </div>
  )
}

export default NavSteps