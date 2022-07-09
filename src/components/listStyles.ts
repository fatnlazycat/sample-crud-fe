import { Carousel } from 'antd';
import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  background-color: black;
  text-align: center;
`;

export const Title = styled.p`
  text-align: center;
  color: wheat;
`;

export const CarouselContainer = styled.div`
  width: 50%;
  margin: 10px auto;
`;

export const StyledCarousel = styled(Carousel)`
  
`;

export const SwitchContainer = styled.div`
  text-align: center;
`;

export const CompletedLabel = styled.span`
  color: white;
  margin-right: 3px;
`;

export const ButtonsContainer = styled.div`
  margin: 10px;
  text-align: center;
`;