import React from 'react';
import './navstyle.css';

const NavSteps = ({list, activeNav}) => {
  return (
    <div className='d-flex gap-2 justify-content-center my-4 w-100 overflow-x-scroll'>
        {list?.map((nav, index) => {
            const isActive = activeNav === nav.slug;
            const isPrevious = index < list.findIndex(item => activeNav === item.slug); // Check if the current nav is before the active one
            const isUpcoming = index > list.findIndex(item => activeNav === item.slug); // Check if the current nav is after the active one

            return (
                <div
                    className='d-flex gap-2 align-items-center me-2'
                    key={nav.id}>
                    <div className={`p-2 rounded-1 d-flex flex-column align-items-center justify-content-center
                        ${isActive ? 'bg-light text-dark' : isPrevious ? 'bg-success' : ''}`}>
                        <small className='bg-inherit max-content fs-5'>{nav.name}</small>
                    </div>
                    {index + 1 < list?.length && (
                        <span
                            className={`border nav-separator ${isPrevious ? 'border-success' : isActive ? 'border-light' : 'border-dark opacity-50'} border-dotted`}
                        />
                    )}
                </div>
            );
        })}
    </div>
  )
}

export default NavSteps