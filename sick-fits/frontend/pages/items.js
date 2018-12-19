import Items from '../components/Items';

export default props => (
  <div>
    <Items page={+props.query.page || 1} />
  </div>
);
