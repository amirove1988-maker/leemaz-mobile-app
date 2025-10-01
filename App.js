import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions,
  Platform,
  I18nManager,
  Image,
} from 'react-native';

// Leemaz Logo Base64
const LEEMAZ_LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAACfX2nNAAAAUVBMVEVHcExlY3xla3Vme3dlcGxpd3h0fXhxcnl1d3iAc3h0eXt9d3cAd3qAdXmEfHx7e3t3cXl1cXV2d3iEe3t1cXltd3h5cnkAd3p6gnl2dnIoe3t5dnjK4xXkAAAADHRSTlMA+Qz4sFhQhIe7l4vH5JpMAAACJ0lEQVR42u3dPY7CMBCGYfB61h5mS54I87L//29oWp1JtF9/cQhESyMhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC7g2/oKx+c096o7P1dM37/g0z6M6fO5mN+q7+Wj0/L/L5v7s+Hl3/m+X3e/Hn8fF/b/F9X7fPz/h/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/N/b+P7v+d0/";

// Mock user data
const mockUsers = {
  'buyer@leemaz.com': {
    id: '1',
    email: 'buyer@leemaz.com',
    name: 'Sarah Ahmed',
    role: 'buyer',
    credits: 150,
  },
  'seller@leemaz.com': {
    id: '2',
    email: 'seller@leemaz.com',
    name: 'Fatima Al-Rashid',
    role: 'seller',
    credits: 75,
  },
  'admin@leemaz.com': {
    id: '3',
    email: 'admin@leemaz.com',
    name: 'Admin User',
    role: 'admin',
    credits: 1000,
  },
};

// Mock shops data
const mockShops = [
  {
    id: '1',
    name: 'Handmade Treasures',
    owner: 'Fatima Al-Rashid',
    description: 'Authentic Syrian handicrafts and jewelry',
    logo: null,
    approved: true,
  },
  {
    id: '2',
    name: 'Traditional Crafts',
    owner: 'Aisha Hassan',
    description: 'Beautiful traditional Syrian textiles',
    logo: null,
    approved: true,
  },
];

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Hand-woven Scarf',
    price: 45,
    category: 'clothing',
    description: 'Beautiful traditional Syrian scarf',
    shopId: '1',
    shopName: 'Handmade Treasures',
    image: null,
  },
  {
    id: '2',
    name: 'Silver Bracelet',
    price: 75,
    category: 'jewelry',
    description: 'Elegant handcrafted silver bracelet',
    shopId: '1',
    shopName: 'Handmade Treasures',
    image: null,
  },
  {
    id: '3',
    name: 'Rose Perfume Oil',
    price: 25,
    category: 'perfumes',
    description: 'Natural Syrian rose perfume oil',
    shopId: '2',
    shopName: 'Traditional Crafts',
    image: null,
  },
  {
    id: '4',
    name: 'Herbal Tea Mix',
    price: 15,
    category: 'herbal',
    description: 'Traditional Syrian herbal tea blend',
    shopId: '2',
    shopName: 'Traditional Crafts',
    image: null,
  },
];

const { width, height } = Dimensions.get('window');

// Get screen dimensions and set proper mobile sizing
const screenWidth = Math.min(width, 400);
const screenHeight = Math.min(height, 800);

// Translations
const translations = {
  en: {
    welcome: 'Welcome to Leemaz',
    subtitle: 'Syrian Women\'s Marketplace',
    home: 'Home',
    shop: 'Shop',
    profile: 'Profile',
    favorites: 'Favorites',
    orders: 'Orders',
    chat: 'Chat',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    products: 'Products',
    empowering: 'Empowering Syrian Women Entrepreneurs',
    discover: 'Discover authentic handmade products',
    switchLanguage: 'Switch to Arabic',
    myProfile: 'My Profile',
    changeLanguage: 'Change Language',
    settings: 'Settings',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    userType: 'I am a',
    buyer: 'Buyer',
    seller: 'Seller',
    language: 'Language',
    english: 'English',
    arabic: 'Arabic',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    signUp: 'Sign Up',
    credits: 'Credits',
    requestCredits: 'Request Credits',
    manageUsers: 'Manage Users',
    manageProducts: 'Manage Products',
    adminPanel: 'Admin Panel',
    dashboard: 'Dashboard',
    totalUsers: 'Total Users',
    totalShops: 'Total Shops',
    totalProducts: 'Total Products',
    searchPlaceholder: 'Search products...',
    categories: 'Categories',
    all: 'All',
    clothing: 'Clothing',
    jewelry: 'Jewelry',
    handicrafts: 'Handicrafts',
    perfumes: 'Perfumes & Oils',
    herbal: 'Herbal Products',
    soaps: 'Natural Soaps',
    candles: 'Handmade Candles',
    pottery: 'Pottery & Ceramics',
    textiles: 'Traditional Textiles',
    woodwork: 'Wooden Crafts',
    metalwork: 'Metal Crafts',
    leather: 'Leather Goods',
    baskets: 'Woven Baskets',
    spices: 'Spices & Seasonings',
    sweets: 'Traditional Sweets',
    embroidery: 'Embroidered Items',
    rugs: 'Handmade Rugs',
    bags: 'Handcrafted Bags',
    accessories: 'Fashion Accessories',
    homeDecor: 'Home Decoration',
    kitchenware: 'Kitchen Items',
    cosmetics: 'Natural Cosmetics',
    incense: 'Incense & Aromatics',
    viewDetails: 'View Details',
    buyNow: 'Buy Now',
    addToFavorites: 'Add to Favorites',
    price: 'Price',
    description: 'Description',
    shopName: 'Shop Name',
    noProductsFound: 'No products found',
    noFavorites: 'No favorites yet',
    noOrders: 'No orders yet',
    noMessages: 'No messages yet',
    sendMessage: 'Send message...',
    send: 'Send',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    confirmLogout: 'Are you sure you want to logout?',
    yes: 'Yes',
    no: 'No',
    accountSettings: 'Account Settings',
    notificationSettings: 'Notification Settings',
    privacySettings: 'Privacy Settings',
    help: 'Help & Support',
    about: 'About Leemaz',
    version: 'Version 1.0.0',
    madeWith: 'Made with ❤️ for Syrian women entrepreneurs',
    copyrightText: '© 2024 Leemaz. All rights reserved.',
    roleBasedMessage: 'You are logged in as',
    sellerCannotBuy: 'As a seller, you can list your products here',
    createShop: 'Create Shop',
    myShop: 'My Shop',
    addProduct: 'Add Product',
    notificationsEnabled: 'Notifications Enabled',
    pushNotifications: 'Push Notifications',
    emailNotifications: 'Email Notifications',
    smsNotifications: 'SMS Notifications',
    publicProfile: 'Public Profile',
    showEmail: 'Show Email',
    showPhone: 'Show Phone Number',
    allowMessages: 'Allow Direct Messages',
    helpCenter: 'Help Center',
    contactSupport: 'Contact Support',
    reportIssue: 'Report an Issue',
    faqs: 'Frequently Asked Questions',
    productName: 'Product Name',
    selectImage: 'Select Image',
    imageSelected: 'Image Selected ✓',
    notifications: 'Notifications',
    noNotifications: 'No notifications yet',
    newOrder: 'New Order Received!',
    creditApproved: 'Credit Request Approved!',
    encouragement: 'Keep up the great work!',
    favoritePromotion: 'Check out your favorite products!',
    sendNotification: 'Send Notification',
    notificationSent: 'Notification Sent Successfully!',
    encourageMessage: 'Message to encourage sellers',
    promoteFavorites: 'Promote Favorite Products',
    markAsRead: 'Mark as Read',
    viewNotifications: 'View Notifications'
  },
  ar: {
    welcome: 'أهلاً بك في ليماز',
    subtitle: 'سوق المرأة السورية',
    home: 'الرئيسية',
    shop: 'المتجر',
    profile: 'الملف الشخصي',
    favorites: 'المفضلة',
    orders: 'الطلبات',
    chat: 'المحادثة',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    products: 'المنتجات',
    empowering: 'تمكين النساء السوريات',
    discover: 'اكتشفي منتجات يدوية أصيلة',
    switchLanguage: 'التبديل للإنجليزية',
    myProfile: 'ملفي الشخصي',
    changeLanguage: 'تغيير اللغة',
    settings: 'الإعدادات',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    fullName: 'الاسم الكامل',
    userType: 'أنا',
    buyer: 'مشترية',
    seller: 'بائعة',
    language: 'اللغة',
    english: 'الإنجليزية',
    arabic: 'العربية',
    createAccount: 'إنشاء حساب',
    alreadyHaveAccount: 'لديك حساب بالفعل؟',
    dontHaveAccount: 'ليس لديك حساب؟',
    signUp: 'سجلي الآن',
    credits: 'الرصيد',
    requestCredits: 'طلب رصيد',
    manageUsers: 'إدارة المستخدمين',
    manageProducts: 'إدارة المنتجات',
    adminPanel: 'لوحة الإدارة',
    dashboard: 'لوحة المعلومات',
    totalUsers: 'إجمالي المستخدمين',
    totalShops: 'إجمالي المتاجر',
    totalProducts: 'إجمالي المنتجات',
    searchPlaceholder: 'البحث عن منتجات...',
    categories: 'الفئات',
    all: 'الكل',
    clothing: 'الملابس',
    jewelry: 'المجوهرات',
    handicrafts: 'الحرف اليدوية',
    perfumes: 'العطور والزيوت',
    herbal: 'المنتجات العشبية',
    soaps: 'الصابون الطبيعي',
    candles: 'الشموع اليدوية',
    pottery: 'الفخار والسيراميك',
    textiles: 'المنسوجات التقليدية',
    woodwork: 'الأعمال الخشبية',
    metalwork: 'الأعمال المعدنية',
    leather: 'المنتجات الجلدية',
    baskets: 'السلال المنسوجة',
    spices: 'البهارات والتوابل',
    sweets: 'الحلويات التقليدية',
    embroidery: 'المطرزات',
    rugs: 'السجاد اليدوي',
    bags: 'الحقائب اليدوية',
    accessories: 'إكسسوارات الموضة',
    homeDecor: 'ديكور المنزل',
    kitchenware: 'أدوات المطبخ',
    cosmetics: 'مستحضرات التجميل الطبيعية',
    incense: 'البخور والعطريات',
    viewDetails: 'عرض التفاصيل',
    buyNow: 'اشتري الآن',
    addToFavorites: 'أضف للمفضلة',
    price: 'السعر',
    description: 'الوصف',
    shopName: 'اسم المتجر',
    noProductsFound: 'لم يتم العثور على منتجات',
    noFavorites: 'لا توجد مفضلة بعد',
    noOrders: 'لا توجد طلبات بعد',
    noMessages: 'لا توجد رسائل بعد',
    sendMessage: 'إرسال رسالة...',
    send: 'إرسال',
    back: 'رجوع',
    cancel: 'إلغاء',
    save: 'حفظ',
    edit: 'تعديل',
    delete: 'حذف',
    confirmLogout: 'هل أنت متأكدة من تسجيل الخروج؟',
    yes: 'نعم',
    no: 'لا',
    accountSettings: 'إعدادات الحساب',
    notificationSettings: 'إعدادات الإشعارات',
    privacySettings: 'إعدادات الخصوصية',
    help: 'المساعدة والدعم',
    about: 'حول ليماز',
    version: 'الإصدار 1.0.0',
    madeWith: 'صُنع بـ ❤️ للنساء السوريات',
    copyrightText: '© 2024 ليماز. جميع الحقوق محفوظة.',
    roleBasedMessage: 'أنت مسجلة الدخول كـ',
    sellerCannotBuy: 'كبائعة، يمكنك عرض منتجاتك هنا',
    createShop: 'إنشاء متجر',
    myShop: 'متجري',
    addProduct: 'إضافة منتج',
    notificationsEnabled: 'الإشعارات مفعلة',
    pushNotifications: 'الإشعارات الفورية',
    emailNotifications: 'إشعارات البريد الإلكتروني',
    smsNotifications: 'الرسائل النصية',
    publicProfile: 'الملف العام',
    showEmail: 'إظهار البريد الإلكتروني',
    showPhone: 'إظهار رقم الهاتف',
    allowMessages: 'السماح بالرسائل المباشرة',
    helpCenter: 'مركز المساعدة',
    contactSupport: 'اتصل بالدعم',
    reportIssue: 'إبلاغ عن مشكلة',
    faqs: 'الأسئلة الشائعة',
    productName: 'اسم المنتج',
    selectImage: 'اختيار صورة',
    imageSelected: 'تم اختيار الصورة ✓',
    notifications: 'الإشعارات',
    noNotifications: 'لا توجد إشعارات بعد',
    newOrder: 'تم استلام طلب جديد!',
    creditApproved: 'تم الموافقة على طلب الرصيد!',
    encouragement: 'استمري في العمل الرائع!',
    favoritePromotion: 'تفقدي منتجاتك المفضلة!',
    sendNotification: 'إرسال إشعار',
    notificationSent: 'تم إرسال الإشعار بنجاح!',
    encourageMessage: 'رسالة لتشجيع البائعات',
    promoteFavorites: 'ترويج المنتجات المفضلة',
    markAsRead: 'وضع علامة كمقروءة',
    viewNotifications: 'عرض الإشعارات'
  }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'buyer',
    language: 'en'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    push: true,
    email: true,
    sms: false
  });
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showEmail: false,
    showPhone: false,
    allowMessages: true
  });
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'handicrafts',
    description: '',
    image: null
  });

  // Notification System State
  const [notifications, setNotifications] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showSendNotificationModal, setShowSendNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Set RTL for Arabic
  useEffect(() => {
    if (currentLanguage === 'ar') {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  }, [currentLanguage]);

  const t = (key) => translations[currentLanguage][key] || key;

  // Notification Functions
  const sendNotification = (userId, type, message, title) => {
    const notification = {
      id: Date.now().toString(),
      userId,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [notification, ...prev]);
    
    // If notification is for current user, show alert and increment unread count
    if (userId === currentUser?.id || userId === 'all') {
      setUnreadNotifications(prev => prev + 1);
      Alert.alert(title, message);
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadNotifications(prev => Math.max(0, prev - 1));
  };

  const getUserNotifications = () => {
    return notifications.filter(notif => 
      notif.userId === currentUser?.id || notif.userId === 'all'
    );
  };

  const handleLogin = () => {
    const user = mockUsers[loginForm.email];
    if (user && loginForm.password === 'password123') {
      setCurrentUser(user);
      setCurrentScreen('Home');
      Alert.alert('Success', `Welcome ${user.name}!`);
    } else {
      Alert.alert('Error', 'Invalid credentials. Try: buyer@leemaz.com / seller@leemaz.com / admin@leemaz.com with password: password123');
    }
  };

  const handleRegister = () => {
    if (registerForm.password !== registerForm.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!registerForm.fullName || !registerForm.email || !registerForm.password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    // Validate mobile number for Syrian format
    if (registerForm.userType === 'seller' && registerForm.email.includes('seller')) {
      // Mock Syrian mobile validation
      Alert.alert('Success', 'Account created successfully! Please verify your Syrian mobile number.');
    } else {
      Alert.alert('Success', 'Account created successfully! You can now login.');
    }
    setCurrentScreen('Login');
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('Login');
    setShowLogoutModal(false);
    setLoginForm({ email: '', password: '' });
    setNotifications([]);
    setUnreadNotifications(0);
  };

  const navigateToScreen = (screenName) => {
    setCurrentScreen(screenName);
  };

  const addToFavorites = (product) => {
    if (!favorites.find(fav => fav.id === product.id)) {
      setFavorites([...favorites, product]);
      Alert.alert('Success', 'Added to favorites!');
      
      // Send notification to buyer about favorite product promotion
      if (currentUser.role === 'buyer') {
        setTimeout(() => {
          sendNotification(
            currentUser.id,
            'promotion',
            t('favoritePromotion'),
            '🛍️ ' + t('promoteFavorites')
          );
        }, 30000); // Send after 30 seconds
      }
    }
  };

  const buyProduct = (product) => {
    if (currentUser.role === 'seller') {
      Alert.alert('Notice', t('sellerCannotBuy'));
      return;
    }
    const newOrder = {
      id: Date.now().toString(),
      product,
      date: new Date().toLocaleDateString(),
      status: 'pending'
    };
    setOrders([...orders, newOrder]);
    Alert.alert('Success', 'Order placed successfully!');

    // Send notification to seller about new order
    sendNotification(
      '2', // Mock seller ID
      'order',
      `New order for ${product.name} - $${product.price}`,
      '🛒 ' + t('newOrder')
    );
  };

  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: messageInput,
        sender: currentUser.name,
        time: new Date().toLocaleTimeString()
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const requestCredits = () => {
    Alert.alert('Credit Request', 'Your credit request has been submitted to the admin. You will be notified once approved.', [
      { text: 'OK', style: 'default' }
    ]);

    // Simulate admin approval after 5 seconds
    setTimeout(() => {
      sendNotification(
        currentUser.id,
        'credit',
        'Your credit request of 100 credits has been approved!',
        '💰 ' + t('creditApproved')
      );
    }, 5000);
  };

  const manageUsers = () => {
    Alert.alert('User Management', 'Admin User Management Features:\n\n• View all registered users\n• Approve seller accounts\n• Manage user credits\n• Handle user reports\n• Send notifications to users', [
      { text: 'OK', style: 'default' }
    ]);
  };

  const manageProducts = () => {
    Alert.alert('Product Management', 'Admin Product Management Features:\n\n• Review and approve products\n• Moderate product content\n• Manage product categories\n• Handle product reports\n• Set featured products', [
      { text: 'OK', style: 'default' }
    ]);
  };

  const pickImage = () => {
    Alert.alert(
      'Select Image',
      'Choose how to select an image for your product:',
      [
        { text: 'Camera', onPress: () => mockImagePicker('camera') },
        { text: 'Gallery', onPress: () => mockImagePicker('gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const mockImagePicker = (source) => {
    // Mock image picker - in real app, this would use expo-image-picker
    const mockImageBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";
    
    setNewProduct({ ...newProduct, image: mockImageBase64 });
    Alert.alert('Success', `Image selected from ${source}!`);
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      shopId: '1', // Mock shop ID
      shopName: 'My Shop',
      image: newProduct.image
    };

    // In real app, this would be sent to backend
    mockProducts.push(product);
    
    Alert.alert('Success', 'Product added successfully!');
    setNewProduct({ name: '', price: '', category: 'handicrafts', description: '', image: null });
    setShowAddProductModal(false);
  };

  const sendEncouragementNotification = () => {
    if (!notificationMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    // Send to all sellers
    sendNotification(
      'all',
      'encouragement',
      notificationMessage,
      '🌟 ' + t('encouragement')
    );

    Alert.alert('Success', t('notificationSent'));
    setNotificationMessage('');
    setShowSendNotificationModal(false);
  };

  const getFilteredProducts = () => {
    let filtered = mockProducts;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const renderHeader = () => (
    <View style={[styles.header, currentLanguage === 'ar' && styles.rtlContainer]}>
      <View style={styles.headerContent}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: LEEMAZ_LOGO_BASE64 }}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoFallback}>Leemaz</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Leemaz</Text>
          <Text style={styles.headerSubtitle}>{t('subtitle')}</Text>
        </View>
        {currentUser && (
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => setShowNotificationModal(true)}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
            {unreadNotifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderBottomTabs = () => {
    if (!currentUser || currentUser.role === 'admin') return null;
    
    const tabs = [
      { key: 'Home', icon: '🏠', label: t('home') },
      { key: 'Shop', icon: '🛍️', label: t('shop') },
      { key: 'Favorites', icon: '❤️', label: t('favorites'), buyerOnly: true },
      { key: 'Orders', icon: '📦', label: t('orders') },
      { key: 'Chat', icon: '💬', label: t('chat') },
      { key: 'Profile', icon: '👤', label: t('profile') }
    ];

    return (
      <View style={[styles.bottomTabs, currentLanguage === 'ar' && styles.rtlContainer]}>
        {tabs.map(tab => {
          if (tab.buyerOnly && currentUser.role !== 'buyer') return null;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, currentScreen === tab.key && styles.activeTab]}
              onPress={() => navigateToScreen(tab.key)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderLoginScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={[styles.welcomeText, currentLanguage === 'ar' && styles.rtlText]}>
            {t('welcome')}
          </Text>
          <Text style={[styles.subtitleText, currentLanguage === 'ar' && styles.rtlText]}>
            {t('empowering')}
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('email')}
              value={loginForm.email}
              onChangeText={(text) => setLoginForm({...loginForm, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('password')}
              value={loginForm.password}
              onChangeText={(text) => setLoginForm({...loginForm, password: text})}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
            <Text style={styles.primaryButtonText}>{t('login')}</Text>
          </TouchableOpacity>
          
          <View style={styles.linkContainer}>
            <Text style={[styles.linkText, currentLanguage === 'ar' && styles.rtlText]}>
              {t('dontHaveAccount')}
            </Text>
            <TouchableOpacity onPress={() => setCurrentScreen('Register')}>
              <Text style={styles.linkButton}> {t('signUp')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.languageButton} 
            onPress={() => setShowLanguageModal(true)}
          >
            <Text style={styles.languageButtonText}>
              {currentLanguage === 'en' ? '🇸🇦 العربية' : '🇺🇸 English'}
            </Text>
          </TouchableOpacity>

          <View style={styles.demoInfo}>
            <Text style={[styles.demoText, currentLanguage === 'ar' && styles.rtlText]}>
              Demo Accounts:
            </Text>
            <Text style={styles.demoCredentials}>buyer@leemaz.com / password123</Text>
            <Text style={styles.demoCredentials}>seller@leemaz.com / password123</Text>
            <Text style={styles.demoCredentials}>admin@leemaz.com / password123</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderRegisterScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.formContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
          <Text style={[styles.welcomeText, currentLanguage === 'ar' && styles.rtlText]}>
            {t('createAccount')}
          </Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('fullName')}
              value={registerForm.fullName}
              onChangeText={(text) => setRegisterForm({...registerForm, fullName: text})}
            />
            <TextInput
              style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('email')}
              value={registerForm.email}
              onChangeText={(text) => setRegisterForm({...registerForm, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('password')}
              value={registerForm.password}
              onChangeText={(text) => setRegisterForm({...registerForm, password: text})}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('confirmPassword')}
              value={registerForm.confirmPassword}
              onChangeText={(text) => setRegisterForm({...registerForm, confirmPassword: text})}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
            <Text style={styles.primaryButtonText}>{t('register')}</Text>
          </TouchableOpacity>
          
          <View style={styles.linkContainer}>
            <Text style={[styles.linkText, currentLanguage === 'ar' && styles.rtlText]}>
              {t('alreadyHaveAccount')}
            </Text>
            <TouchableOpacity onPress={() => setCurrentScreen('Login')}>
              <Text style={styles.linkButton}> {t('login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderHomeScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.homeContent}>
          <Text style={[styles.welcomeText, currentLanguage === 'ar' && styles.rtlText]}>
            {t('welcome')} {currentUser?.name}!
          </Text>
          <Text style={[styles.subtitleText, currentLanguage === 'ar' && styles.rtlText]}>
            {t('discover')}
          </Text>
          
          <View style={styles.searchContainer}>
            <TextInput
              style={[styles.searchInput, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.categoriesContainer}>
            <Text style={[styles.sectionTitle, currentLanguage === 'ar' && styles.rtlText]}>
              {t('categories')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['all', 'clothing', 'jewelry', 'handicrafts', 'perfumes', 'herbal', 'soaps', 'candles', 'pottery', 'textiles', 'woodwork', 'metalwork', 'leather', 'baskets', 'spices', 'sweets', 'embroidery', 'rugs', 'bags', 'accessories', 'homeDecor', 'kitchenware', 'cosmetics', 'incense'].map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.activeCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.activeCategoryButtonText,
                    currentLanguage === 'ar' && styles.rtlText
                  ]}>
                    {t(category)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.productsContainer}>
            <Text style={[styles.sectionTitle, currentLanguage === 'ar' && styles.rtlText]}>
              {t('products')}
            </Text>
            {getFilteredProducts().length === 0 ? (
              <Text style={[styles.emptyText, currentLanguage === 'ar' && styles.rtlText]}>
                {t('noProductsFound')}
              </Text>
            ) : (
              getFilteredProducts().map(product => (
                <View key={product.id} style={styles.productCard}>
                  <View style={styles.productInfo}>
                    <Text style={[styles.productName, currentLanguage === 'ar' && styles.rtlText]}>
                      {product.name}
                    </Text>
                    <Text style={[styles.productDescription, currentLanguage === 'ar' && styles.rtlText]}>
                      {product.description}
                    </Text>
                    <Text style={styles.productPrice}>${product.price}</Text>
                    <Text style={[styles.productShop, currentLanguage === 'ar' && styles.rtlText]}>
                      {product.shopName}
                    </Text>
                  </View>
                  <View style={styles.productActions}>
                    {currentUser.role === 'buyer' && (
                      <>
                        <TouchableOpacity
                          style={styles.secondaryButton}
                          onPress={() => addToFavorites(product)}
                        >
                          <Text style={styles.secondaryButtonText}>❤️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.primaryButton}
                          onPress={() => buyProduct(product)}
                        >
                          <Text style={styles.primaryButtonText}>{t('buyNow')}</Text>
                        </TouchableOpacity>
                      </>
                    )}
                    {currentUser.role === 'seller' && (
                      <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>{t('viewDetails')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderProfileScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileContent}>
          <View style={styles.profileHeader}>
            <Text style={styles.profileIcon}>👤</Text>
            <Text style={[styles.profileName, currentLanguage === 'ar' && styles.rtlText]}>
              {currentUser?.name}
            </Text>
            <Text style={[styles.profileEmail, currentLanguage === 'ar' && styles.rtlText]}>
              {currentUser?.email}
            </Text>
            <Text style={[styles.profileRole, currentLanguage === 'ar' && styles.rtlText]}>
              {t('roleBasedMessage')}: {t(currentUser?.role)}
            </Text>
            <Text style={[styles.profileCredits, currentLanguage === 'ar' && styles.rtlText]}>
              {t('credits')}: {currentUser?.credits}
            </Text>
          </View>
          
          <View style={styles.profileActions}>
            {currentUser?.role === 'seller' && (
              <>
                <TouchableOpacity style={styles.actionButton} onPress={() => setShowAddProductModal(true)}>
                  <Text style={styles.actionButtonText}>{t('addProduct')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={requestCredits}>
                  <Text style={styles.actionButtonText}>{t('requestCredits')}</Text>
                </TouchableOpacity>
              </>
            )}
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={styles.actionButtonText}>{t('changeLanguage')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
              <Text style={styles.actionButtonText}>{t('logout')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderFavoritesScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.favoritesContent}>
          <Text style={[styles.screenTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('favorites')}
          </Text>
          {favorites.length === 0 ? (
            <Text style={[styles.emptyText, currentLanguage === 'ar' && styles.rtlText]}>
              {t('noFavorites')}
            </Text>
          ) : (
            favorites.map(product => (
              <View key={product.id} style={styles.favoriteItem}>
                <Text style={[styles.favoriteItemName, currentLanguage === 'ar' && styles.rtlText]}>
                  {product.name}
                </Text>
                <Text style={styles.favoriteItemPrice}>${product.price}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderOrdersScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.ordersContent}>
          <Text style={[styles.screenTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('orders')}
          </Text>
          {orders.length === 0 ? (
            <Text style={[styles.emptyText, currentLanguage === 'ar' && styles.rtlText]}>
              {t('noOrders')}
            </Text>
          ) : (
            orders.map(order => (
              <View key={order.id} style={styles.orderItem}>
                <Text style={[styles.orderItemName, currentLanguage === 'ar' && styles.rtlText]}>
                  {order.product.name}
                </Text>
                <Text style={[styles.orderItemDate, currentLanguage === 'ar' && styles.rtlText]}>
                  {order.date}
                </Text>
                <Text style={styles.orderItemStatus}>{order.status}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderChatScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.chatContent}>
          <Text style={[styles.screenTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('chat')}
          </Text>
          <View style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <Text style={[styles.emptyText, currentLanguage === 'ar' && styles.rtlText]}>
                {t('noMessages')}
              </Text>
            ) : (
              messages.map(message => (
                <View key={message.id} style={styles.messageItem}>
                  <Text style={[styles.messageSender, currentLanguage === 'ar' && styles.rtlText]}>
                    {message.sender}
                  </Text>
                  <Text style={[styles.messageText, currentLanguage === 'ar' && styles.rtlText]}>
                    {message.text}
                  </Text>
                  <Text style={styles.messageTime}>{message.time}</Text>
                </View>
              ))
            )}
          </View>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={[styles.messageInput, currentLanguage === 'ar' && styles.rtlInput]}
              placeholder={t('sendMessage')}
              value={messageInput}
              onChangeText={setMessageInput}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>{t('send')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderShopScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.shopContent}>
          <Text style={[styles.screenTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('shop')}
          </Text>
          {mockShops.map(shop => (
            <View key={shop.id} style={styles.shopItem}>
              <Text style={[styles.shopName, currentLanguage === 'ar' && styles.rtlText]}>
                {shop.name}
              </Text>
              <Text style={[styles.shopOwner, currentLanguage === 'ar' && styles.rtlText]}>
                Owner: {shop.owner}
              </Text>
              <Text style={[styles.shopDescription, currentLanguage === 'ar' && styles.rtlText]}>
                {shop.description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      {renderBottomTabs()}
    </SafeAreaView>
  );

  const renderAdminPanel = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.adminContent}>
          <View style={[styles.adminTitleContainer, currentLanguage === 'ar' && styles.rtlContainer]}>
            <Image 
              source={{ uri: LEEMAZ_LOGO_BASE64 }}
              style={styles.adminLogoImage}
              resizeMode="contain"
            />
            <Text style={[styles.screenTitle, styles.adminTitle, currentLanguage === 'ar' && styles.rtlText]}>
              {t('adminPanel')}
            </Text>
          </View>
          
          <View style={styles.adminStats}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={[styles.statLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {t('totalUsers')}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={[styles.statLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {t('totalShops')}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={[styles.statLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {t('totalProducts')}
              </Text>
            </View>
          </View>
          
          <View style={styles.adminActions}>
            <TouchableOpacity style={styles.adminButton} onPress={manageUsers}>
              <Text style={styles.adminButtonText}>{t('manageUsers')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adminButton} onPress={manageProducts}>
              <Text style={styles.adminButtonText}>{t('manageProducts')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.adminButton} 
              onPress={() => setShowSendNotificationModal(true)}
            >
              <Text style={styles.adminButtonText}>📢 {t('sendNotification')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => setShowLanguageModal(true)}
            >
              <Text style={styles.adminButtonText}>{t('changeLanguage')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adminButton} onPress={handleLogout}>
              <Text style={styles.adminButtonText}>{t('logout')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderNotificationModal = () => {
    const userNotifications = getUserNotifications();
    
    return (
      <Modal
        visible={showNotificationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.largeModalContainer}>
            <Text style={[styles.modalTitle, currentLanguage === 'ar' && styles.rtlText]}>
              🔔 {t('notifications')}
            </Text>
            
            <ScrollView style={styles.modalScrollView}>
              {userNotifications.length === 0 ? (
                <Text style={[styles.emptyText, currentLanguage === 'ar' && styles.rtlText]}>
                  {t('noNotifications')}
                </Text>
              ) : (
                userNotifications.map(notification => (
                  <View key={notification.id} style={[
                    styles.notificationItem,
                    !notification.read && styles.unreadNotification
                  ]}>
                    <Text style={[styles.notificationTitle, currentLanguage === 'ar' && styles.rtlText]}>
                      {notification.title}
                    </Text>
                    <Text style={[styles.notificationMessage, currentLanguage === 'ar' && styles.rtlText]}>
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {new Date(notification.timestamp).toLocaleString()}
                    </Text>
                    {!notification.read && (
                      <TouchableOpacity
                        style={styles.markReadButton}
                        onPress={() => markNotificationAsRead(notification.id)}
                      >
                        <Text style={styles.markReadButtonText}>{t('markAsRead')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowNotificationModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderSendNotificationModal = () => (
    <Modal
      visible={showSendNotificationModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowSendNotificationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, currentLanguage === 'ar' && styles.rtlText]}>
            📢 {t('sendNotification')}
          </Text>
          
          <TextInput
            style={[styles.textArea, currentLanguage === 'ar' && styles.rtlInput]}
            placeholder={t('encourageMessage')}
            value={notificationMessage}
            onChangeText={setNotificationMessage}
            multiline
            numberOfLines={4}
          />
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={sendEncouragementNotification}>
              <Text style={styles.modalButtonText}>{t('send')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalCancelButton} 
              onPress={() => setShowSendNotificationModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderLanguageModal = () => (
    <Modal
      visible={showLanguageModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowLanguageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('changeLanguage')}
          </Text>
          
          <TouchableOpacity
            style={[styles.languageOption, currentLanguage === 'en' && styles.selectedLanguage]}
            onPress={() => {
              setCurrentLanguage('en');
              setShowLanguageModal(false);
            }}
          >
            <Text style={styles.languageOptionText}>🇺🇸 English</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.languageOption, currentLanguage === 'ar' && styles.selectedLanguage]}
            onPress={() => {
              setCurrentLanguage('ar');
              setShowLanguageModal(false);
            }}
          >
            <Text style={styles.languageOptionText}>🇸🇦 العربية</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={() => setShowLanguageModal(false)}
          >
            <Text style={styles.modalCancelButtonText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderLogoutModal = () => (
    <Modal
      visible={showLogoutModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowLogoutModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('confirmLogout')}
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={confirmLogout}>
              <Text style={styles.modalButtonText}>{t('yes')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalCancelButton} 
              onPress={() => setShowLogoutModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>{t('no')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderAddProductModal = () => (
    <Modal
      visible={showAddProductModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAddProductModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.largeModalContainer}>
          <Text style={[styles.modalTitle, currentLanguage === 'ar' && styles.rtlText]}>
            {t('addProduct')}
          </Text>
          
          <ScrollView style={styles.modalScrollView}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
                placeholder={t('productName')}
                value={newProduct.name}
                onChangeText={(text) => setNewProduct({...newProduct, name: text})}
              />
              
              <TextInput
                style={[styles.input, currentLanguage === 'ar' && styles.rtlInput]}
                placeholder={t('price')}
                value={newProduct.price}
                onChangeText={(text) => setNewProduct({...newProduct, price: text})}
                keyboardType="numeric"
              />
              
              <Text style={[styles.inputLabel, currentLanguage === 'ar' && styles.rtlText]}>
                {t('category')}:
              </Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
                {['handicrafts', 'perfumes', 'herbal', 'soaps', 'candles', 'pottery', 'textiles', 'jewelry', 'clothing'].map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categorySelectButton,
                      newProduct.category === category && styles.activeCategorySelect
                    ]}
                    onPress={() => setNewProduct({...newProduct, category})}
                  >
                    <Text style={[
                      styles.categorySelectText,
                      newProduct.category === category && styles.activeCategorySelectText,
                      currentLanguage === 'ar' && styles.rtlText
                    ]}>
                      {t(category)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TextInput
                style={[styles.textArea, currentLanguage === 'ar' && styles.rtlInput]}
                placeholder={t('description')}
                value={newProduct.description}
                onChangeText={(text) => setNewProduct({...newProduct, description: text})}
                multiline
                numberOfLines={4}
              />
              
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Text style={styles.imagePickerButtonText}>
                  📷 {newProduct.image ? t('imageSelected') : t('selectImage')}
                </Text>
              </TouchableOpacity>
              
              {newProduct.image && (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: newProduct.image }} style={styles.previewImage} />
                </View>
              )}
            </View>
          </ScrollView>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalButton} onPress={addProduct}>
              <Text style={styles.modalButtonText}>{t('addProduct')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalCancelButton} 
              onPress={() => setShowAddProductModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Main render logic
  if (!currentUser) {
    return (
      <View style={styles.appContainer}>
        {currentScreen === 'Login' && renderLoginScreen()}
        {currentScreen === 'Register' && renderRegisterScreen()}
        {renderLanguageModal()}
      </View>
    );
  }

  if (currentUser.role === 'admin') {
    return (
      <View style={styles.appContainer}>
        {renderAdminPanel()}
        {renderLanguageModal()}
        {renderLogoutModal()}
        {renderNotificationModal()}
        {renderSendNotificationModal()}
      </View>
    );
  }

  return (
    <View style={styles.appContainer}>
      {currentScreen === 'Home' && renderHomeScreen()}
      {currentScreen === 'Profile' && renderProfileScreen()}
      {currentScreen === 'Favorites' && renderFavoritesScreen()}
      {currentScreen === 'Orders' && renderOrdersScreen()}
      {currentScreen === 'Chat' && renderChatScreen()}
      {currentScreen === 'Shop' && renderShopScreen()}
      {renderLanguageModal()}
      {renderLogoutModal()}
      {renderAddProductModal()}
      {renderNotificationModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    width: '100%',
    maxWidth: screenWidth,
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 28,
    color: '#fff',
  },
  logoFallback: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 0,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationIcon: {
    fontSize: 24,
    color: '#fff',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  primaryButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 14,
  },
  linkButton: {
    color: '#E91E63',
    fontSize: 14,
    fontWeight: 'bold',
  },
  languageButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  languageButtonText: {
    color: '#E91E63',
    fontSize: 16,
  },
  demoInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  demoText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  demoCredentials: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  bottomTabs: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeTab: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: '#333',
  },
  rtlContainer: {
    flexDirection: 'row-reverse',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rtlInput: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  homeContent: {
    padding: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#E91E63',
  },
  categoryButtonText: {
    color: '#333',
    fontSize: 14,
  },
  activeCategoryButtonText: {
    color: '#fff',
  },
  productsContainer: {
    marginBottom: 80,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  productShop: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  productActions: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 50,
  },
  profileContent: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 14,
    color: '#E91E63',
    marginBottom: 5,
  },
  profileCredits: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  profileActions: {
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 20,
    textAlign: 'center',
  },
  favoritesContent: {
    padding: 20,
  },
  favoriteItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favoriteItemName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  favoriteItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
  ordersContent: {
    padding: 20,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  orderItemDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderItemStatus: {
    fontSize: 14,
    color: '#E91E63',
  },
  chatContent: {
    padding: 20,
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  messageItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  messageInputContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  shopContent: {
    padding: 20,
  },
  shopItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  shopOwner: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  shopDescription: {
    fontSize: 14,
    color: '#666',
  },
  adminContent: {
    padding: 20,
  },
  adminStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  adminActions: {
    gap: 15,
  },
  adminButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  unreadNotification: {
    backgroundColor: '#fff5f5',
    borderColor: '#E91E63',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  markReadButton: {
    backgroundColor: '#E91E63',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  markReadButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    minWidth: 280,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  languageOption: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#E91E63',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#E91E63',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  modalCancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  largeModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    minWidth: 320,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  categorySelector: {
    marginBottom: 15,
  },
  categorySelectButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
  },
  activeCategorySelect: {
    backgroundColor: '#E91E63',
  },
  categorySelectText: {
    color: '#333',
    fontSize: 12,
  },
  activeCategorySelectText: {
    color: '#fff',
  },
  textArea: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 80,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imagePickerButtonText: {
    color: '#333',
    fontSize: 16,
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: 15,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});