const CategoryCard = ({ category }) => {
    return (
        <div className="card border-0 mb-3" style={{ backgroundColor: 'transparent' }}>
            <img
                src={`https://picsum.photos/220/300?random=${category.id}`}
                className="card-img-top rounded"
                alt={category.name}
            />
            <div className="card-body p-0 pt-2">
                <h6 className="card-title mb-0" style={{ fontSize: '14px' }}>{category.name}</h6>
                <p className="card-text mb-0" style={{ color: 'var(--twitch-text-secondary)', fontSize: '13px' }}>
                    {category.viewers} viewers
                </p>
                <div className="d-flex mt-1">
                    {category.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="badge me-1"
                            style={{
                                backgroundColor: 'var(--twitch-dark-tertiary)',
                                color: 'var(--twitch-text-secondary)',
                                fontSize: '10px'
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;