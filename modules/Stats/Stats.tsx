import { message } from "antd";
import { ethers } from "ethers";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLP_Token } from "../../api";
import { GetStatAction } from "../../api/bakcend.api";
import QuickView from "../../components/QuickView/QuickView";
import { EStatsFilter } from "../../enums/stats.enum";
import { statsSelector } from "../../store/selectors";


export default function Stats() {
    const [stats, setStats] = useState([])
    const [count, setCount] = useState([])
    const [error, setError] = useState<boolean>(false);
    const [next, setNext] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState<string>('');
    const [filter, setFilter] = useState<string>('');

    const fetchStats = async (p: number = 1, s: string = '', f: string = '') => {
        try {
            setLoading(true)
            let res = await GetStatAction({ limit: 10, page: p, query: s, filter: f })
            if (res.success) {
                setStats(res.data.stats)
                setCount(res.data.count)
                setPage(p)
                setNext(res.data.next)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchStats()
    }, [])
    useEffect(() => {

    }, [stats])

    const minText = (date: any) => {
        let min = moment().diff(moment(date), 'minutes')
        if (min > 60 && min < 1440) {
            return `${moment().diff(moment(date), 'hours')} hours`
        }

        if (min > 1440) {
            return `${moment().diff(moment(date), 'days')} days`
        }

        return `${min} mins`
    }


    const onClickNext = () => {
        fetchStats(page + 1, search, filter)
    }

    const onClickPrevios = () => {
        fetchStats(page - 1, search, filter)
    }

    const notify = (value: string) => message.error(value, 2);

    const onChangeSearch = (e: any) => {
        setSearch(e.target.value)
        fetchStats(page, e.target.value, filter)
    }

    const onChangeFilter = (e: any) => {
        setFilter(e.target.value)
        fetchStats(page, search, e.target.value)
    }

    const onSort = () => {
        if (!stats || stats.length === 0) return
        let array = stats.reverse()
        setStats([...array])
    }

    const onSortMethod = (val: string) => {
        console.log("vssvsvsvsv", val)
        let sortedArray = stats.sort((a: any, b: any) => {
            if (val === 'asc') {
                if (a.type < b.type) { return -1; }
                if (a.type > b.type) { return 1; }
                return 0;
            } else {
                if (b.type < a.type) { return -1; }
                if (b.type > a.type) { return 1; }
                return 0;
            }
        })
        setStats([...sortedArray])
    }

    const onSortPrice = (val: string) => {
        console.log("vssvsvsvsv", val)
        let sortedArray = stats.sort((a: any, b: any) => {
            if (val === 'asc') {
                if (Number(a.amount) < Number(b.amount)) { return -1; }
                if (Number(a.amount) > Number(b.amount)) { return 1; }
                return 0;
            } else {
                if (Number(b.amount) < Number(a.amount)) { return -1; }
                if (Number(b.amount) > Number(a.amount)) { return 1; }
                return 0;
            }
        })
        setStats([...sortedArray])
    }

    return (
        <div className="At-Assetpageholder">
            {/* <QuickView totalLFGStaked={totalLFGStaked} count={count} /> */}
            <div className='At-Pagetitle at-pagetitleblock AtPagetitleInput'>
                <h2>Recent transactions</h2>
                <div className="At-SelectHolder">
                    <select className="form-select At-Select" aria-label="Default select example" value={filter} onChange={onChangeFilter}>
                        <option selected value={''}>All</option>
                        <option value={EStatsFilter.deposit}>Deposit</option>
                        <option value={EStatsFilter.claim}>Claim</option>
                        <option value={EStatsFilter.withdraw}>Withdraw</option>
                    </select>

                </div>
                <input type="text" placeholder="Search" value={search} onChange={onChangeSearch} className="At-Input" />
            </div>
            <div className="card mb-4 bg-dark" >
                {/* <div className="card-header">
                    <i className="fas fa-table me-1"></i>
                    
                </div> */}
                <div className="card-body rt-tableholder">
                    <table id="datatablesSimple" className="table table-striped table-dark">
                        <thead>
                            <tr>
                                <th>Txn Hash
                                    <a href="#" className="sort-by" onClick={() => onSort()}></a>
                                    <a href="#" className="At-SortDown" onClick={() => onSort()}></a>
                                </th>
                                <th>Method
                                    <a href="#" className="sort-by" onClick={() => onSortMethod('asc')}></a>
                                    <a href="#" className="At-SortDown" onClick={() => onSortMethod('dec')}></a>
                                </th>
                                <th>Age
                                    <a href="#" className="sort-by" onClick={() => onSort()}></a>
                                    <a href="#" className="At-SortDown" onClick={() => onSort()}></a>
                                </th>
                                <th>From
                                    <a href="#" className="sort-by" onClick={() => onSort()}></a>
                                    <a href="#" className="At-SortDown" onClick={() => onSort()}></a>
                                </th>
                                <th>Quantity
                                    <a href="#" className="sort-by" onClick={() => onSortPrice('asc')}></a>
                                    <a href="#" className="At-SortDown" onClick={() => onSortPrice('dec')}></a>
                                </th>
                            </tr>
                        </thead>
                        {/* <tfoot>
                            <tr>
                                <th>Txn Hash</th>
                                <th>Method</th>
                                <th>Age</th>
                                <th>From</th>
                                <th>Start date</th>
                            </tr>
                        </tfoot> */}
                        <tbody>
                            {stats && stats.length > 0 && [...stats].map((s: any, index: number) => {
                                return (
                                    <tr key={index}>
                                        <td><a href={`https://bscscan.com/tx/${s.hash}`} target={'_blank'}>{s.hash.slice(0, 32)}...</a></td>
                                        <td>{s.type}</td>
                                        <td><small>{minText(s.createdAt)} ago</small></td>
                                        <td>{s.from}</td>
                                        <td>LFG {s.amount}</td>
                                    </tr>
                                )
                            })}

                            {/* <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$170,750</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$86,000</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Transfer</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$433,060</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Transfer</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$162,700</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$372,000</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact Toke...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$137,500</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact Toke...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$327,900</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact Toke...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$205,500</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$103,600</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Office Manager</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$90,560</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$320,800</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$170,750</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$86,000</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Transfer</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$433,060</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Transfer</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$162,700</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$372,000</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact Toke...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$137,500</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact Toke...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$327,900</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact Toke...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$205,500</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$103,600</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Office Manager</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$90,560</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$320,800</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$170,750</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$86,000</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Transfer</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$433,060</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Transfer</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$162,700</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$372,000</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact Toke...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$137,500</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact Toke...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$327,900</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact Toke...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$205,500</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Swap Exact ETH F...</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$103,600</td>
                            </tr>
                            <tr>
                                <td>0x5fcb7dc4ca63a1bec38...</td>
                                <td>Office Manager</td>
                                <td>12 mins ago</td>
                                <td>0x03124d9ef107832409...</td>
                                <td>$90,560</td>
                            </tr> */}

                        </tbody>

                    </table>
                    {loading && <div className="spinner-border text-green mt-4 fs-5" style={{ width: '3rem', height: '3rem', marginLeft: '50%' }} role="status">
                    </div>}
                    <div className="AtPagination">
                        <button
                            className="At-Btn  At-BtnLightGrey"
                            type="button"
                            disabled={page === 1}
                            onClick={() => onClickPrevios()}
                        >
                            Previous
                        </button>
                        <button
                            className="At-Btn  "
                            type="button"
                            disabled={!next}
                            onClick={() => onClickNext()}
                        >
                            Next
                        </button>

                    </div>
                </div>
            </div>
        </div>
    )
}