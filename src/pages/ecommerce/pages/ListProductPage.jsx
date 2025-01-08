import ListProductContainer from "../containers/ListProductContainer"
import propTypes from "prop-types";


const ListProductPage = ({usuario}) => {
  return (
    <div>
      <ListProductContainer usuario={usuario} />
    </div>
  )
}

ListProductPage.propTypes = {
  usuario: propTypes.array,
};

export default ListProductPage
