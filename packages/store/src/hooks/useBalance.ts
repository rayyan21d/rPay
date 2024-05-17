import { balanceAtom } from '../atoms/balance';
import { useRecoilState } from 'recoil';

export const useBalance = ()=>{

    const [value, setValue] = useRecoilState(balanceAtom);
    return value;

}